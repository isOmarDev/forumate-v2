import { PostCommentCommand } from '@forumate/api';
import { type IEventBus } from '@forumate/bus';
import { type IUseCase, Result, success, fail } from '@forumate/core';

import type { IMembersRepository } from '../../../../members/application/ports/members-repository';
import {
  InsufficientMemberLevelError,
  MemberNotFoundError,
} from '../../../../members/domain/errors/member-errors';
import type { IPostsRepository } from '../../../../posts/application/ports/posts-repository';
import { PostNotFoundError } from '../../../../posts/domain/errors/posts-errors';
import { Comment } from '../../../domain/entities/comment';
import { InvalidCommentBodyError } from '../../../domain/errors/comment-errors';
import { CanPostCommentPolicy } from '../../../domain/policies/can-post-comment';
import { CommentBody } from '../../../domain/value-objects/comment-body';
import type { ICommentsRepository } from '../../ports/comments-repository';

export type PostCommentError =
  | MemberNotFoundError
  | PostNotFoundError
  | InsufficientMemberLevelError
  | InvalidCommentBodyError;

export type PostCommentResponse = Result<Comment, PostCommentError>;

export class PostCommentUseCase implements IUseCase<
  PostCommentCommand,
  PostCommentResponse
> {
  constructor(
    private commentsRepository: ICommentsRepository,
    private postsRepository: IPostsRepository,
    private membersRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(command: PostCommentCommand): Promise<PostCommentResponse> {
    const props = command.getProps();

    const member = await this.membersRepository.findById(props.memberId);
    if (!member) {
      return fail(new MemberNotFoundError());
    }

    const canPostComment = CanPostCommentPolicy.check(member);
    if (canPostComment.isFailure) {
      return fail(canPostComment.getError());
    }

    const post = await this.postsRepository.findById(props.postId);
    if (!post) {
      return fail(new PostNotFoundError());
    }

    const commentBodyOrError = CommentBody.create(props.body);
    if (commentBodyOrError.isFailure) {
      return fail(commentBodyOrError.getError());
    }

    const commentOrError = Comment.create({
      ...props,
      body: commentBodyOrError.getValue(),
    });
    if (commentOrError.isFailure) {
      return fail(commentOrError.getError());
    }

    const comment = commentOrError.getValue();

    await this.commentsRepository.save(comment);
    await this.eventBus.publishEvents(comment.getDomainEvents());

    return success(comment);
  }
}
