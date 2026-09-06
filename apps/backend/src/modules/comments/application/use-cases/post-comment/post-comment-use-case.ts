import { PostCommentCommand } from '@forumate/api';
import { type IEventBus } from '@forumate/bus';
import { type IUseCase, Result, success, fail } from '@forumate/core';
import { NotFoundError } from '@forumate/errors/application';

import type { IMembersRepository } from '../../../../members/application/ports/members-repository';
import type { IPostsRepository } from '../../../../posts/application/ports/posts-repository';
import { Comment } from '../../../domain/entities/comment';
import { CanPostCommentPolicy } from '../../../domain/policies/can-post-comment';
import type { ICommentsRepository } from '../../ports/comments-repository';

export type PostCommentResponse = Result<Comment, NotFoundError>;

export class PostCommentUseCase implements IUseCase<
  PostCommentCommand,
  PostCommentResponse
> {
  constructor(
    private commentRepository: ICommentsRepository,
    private postRepository: IPostsRepository,
    private memberRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(command: PostCommentCommand): Promise<PostCommentResponse> {
    // Implement
    throw new Error('Not yet implemented');
  }
}
