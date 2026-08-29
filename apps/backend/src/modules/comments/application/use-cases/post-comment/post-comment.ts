import { PostCommentCommand } from '@forumate/api';
import { type IEventBus } from '@forumate/bus';
import { type IUseCase, Result, success, fail } from '@forumate/core';
import { NotFoundError } from '@forumate/errors/application';

import { type IMembersRepository } from '../../../../members/repos/ports/members-repository';
import { type IPostsRepository } from '../../../../posts/repos/ports/posts-repository';
import { Comment } from '../../../domain/entities/comment';
import { CanPostCommentPolicy } from '../../../domain/policies/can-post-comment';
import { type ICommentRepository } from '../../../repos/ports/comment-repository';

export type PostCommentError = NotFoundError;

export class PostComment implements IUseCase<
  PostCommentCommand,
  Result<Comment, PostCommentError>
> {
  constructor(
    private commentRepository: ICommentRepository,
    private postRepository: IPostsRepository,
    private memberRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(
    command: PostCommentCommand,
  ): Promise<Result<Comment, PostCommentError>> {
    // Implement
    throw new Error('Not yet implemented');
  }
}
