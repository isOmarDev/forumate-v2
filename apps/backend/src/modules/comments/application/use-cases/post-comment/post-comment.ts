import { PostCommentCommand } from '@forumate/api';
import { EventBus } from '@forumate/bus';
import { fail, Result, success, UseCase } from '@forumate/core';
import {
  NotFoundError,
  PermissionError,
  ValidationError,
} from '@forumate/errors/application';

import { MembersRepository } from '../../../../members/repos/ports/members-repository';
import { PostsRepository } from '../../../../posts/repos/ports/posts-repository';
import { Comment } from '../../../domain/entities/comment';
import { CanPostCommentPolicy } from '../../../domain/policies/can-post-comment';
import { CommentRepository } from '../../../repos/ports/comment-repository';

export type PostCommentError =
  ValidationError | PermissionError | NotFoundError;

export class PostComment implements UseCase<
  PostCommentCommand,
  Result<Comment, PostCommentError>
> {
  constructor(
    private commentRepo: CommentRepository,
    private postRepository: PostsRepository,
    private memberRepository: MembersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    command: PostCommentCommand,
  ): Promise<Result<Comment, PostCommentError>> {
    // Implement
    throw new Error('Not yet implemented');
  }
}
