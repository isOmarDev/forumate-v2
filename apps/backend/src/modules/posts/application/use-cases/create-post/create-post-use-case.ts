import { CreatePostCommand } from '@forumate/api/posts';
import { type IEventBus } from '@forumate/bus';
import {
  Result,
  success,
  fail,
  type IUseCase,
} from '@forumate/core/application';

import type { IMembersRepository } from '../../../../members/application/ports/members-repository';
import {
  MemberNotFoundError,
  InsufficientMemberLevelError,
} from '../../../../members/domain/errors/member-errors';
import { type CreatePostProps, Post } from '../../../domain/entities/post';
import {
  InvalidPostContentError,
  InvalidPostLinkError,
  InvalidPostTitleError,
  InvalidPostTypeError,
} from '../../../domain/errors/posts-errors';
import { CanCreatePostPolicy } from '../../../domain/policies/can-create-post';
import {
  PostContent,
  PostLink,
  PostTitle,
  PostType,
} from '../../../domain/value-objects';
import type { IPostsRepository } from '../../ports/posts-repository';

export type CreatePostError =
  | MemberNotFoundError
  | InsufficientMemberLevelError
  | InvalidPostTitleError
  | InvalidPostContentError
  | InvalidPostLinkError
  | InvalidPostTypeError;
export type CreatePostResponse = Result<Post, CreatePostError>;

export class CreatePostUseCase implements IUseCase<
  CreatePostCommand,
  CreatePostResponse
> {
  constructor(
    private postsRepository: IPostsRepository,
    private membersRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(command: CreatePostCommand): Promise<CreatePostResponse> {
    const props = command.getProps();

    const member = await this.membersRepository.getById(props.memberId);
    if (!member) {
      return fail(new MemberNotFoundError());
    }

    const canCreatePost = CanCreatePostPolicy.isAllowed(member);
    if (!canCreatePost) {
      return fail(new InsufficientMemberLevelError());
    }

    const titleOrError = PostTitle.create(props.title);
    if (titleOrError.isFailure) {
      return fail(titleOrError.getError());
    }

    const postTypeOrError = PostType.create(props.postType);
    if (postTypeOrError.isFailure) {
      return fail(postTypeOrError.getError());
    }

    let createProps: CreatePostProps;

    if (props.postType === 'text') {
      const contentOrError = PostContent.create(props.content);
      if (contentOrError.isFailure) {
        return fail(contentOrError.getError());
      }

      createProps = {
        memberId: props.memberId,
        title: titleOrError.getValue(),
        content: contentOrError.getValue(),
        postType: postTypeOrError.getValue(),
      };
    } else {
      const linkOrError = PostLink.create(props.link);
      if (linkOrError.isFailure) {
        return fail(linkOrError.getError());
      }

      createProps = {
        memberId: props.memberId,
        title: titleOrError.getValue(),
        link: linkOrError.getValue(),
        postType: postTypeOrError.getValue(),
      };
    }

    const postOrError = Post.create(createProps);
    if (postOrError.isFailure) {
      return fail(postOrError.getError());
    }

    const post = postOrError.getValue();

    await this.postsRepository.save(post);
    await this.eventBus.publishEvents(post.getDomainEvents());

    return success(post);
  }
}
