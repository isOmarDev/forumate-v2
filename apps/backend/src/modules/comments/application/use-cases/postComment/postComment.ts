import { CommentRepository } from '../../../repos/ports/commentRepository';
import { Comment } from '../../../domain/comment';
import { PostsRepository } from '../../../../posts/repos/ports/postsRepository';
import { CanPostCommentPolicy } from './canPostComment';
import { MembersRepository } from '../../../../members/repos/ports/membersRepository';
import { Result, UseCase, success, fail } from '@forumate/core';
import {
  NotFoundError,
  PermissionError,
  ValidationError,
} from '@forumate/errors/application';
import { PostCommentCommand } from '@forumate/api';
import { EventBus } from '@forumate/bus';

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
