import { PostCommentCommand } from '@forumate/api';
import { IEventBus } from '@forumate/bus';
import { Result } from '@forumate/core';

import { IMembersRepository } from '../../members/repos/ports/members-repository';
import { IPostsRepository } from '../../posts/repos/ports/posts-repository';
import { Comment } from '../domain/entities/comment';
import type { ICommentsRepository } from '../domain/ports/comments-repository';

import {
  PostComment,
  PostCommentError,
} from './use-cases/post-comment/post-comment';

export class CommentsService {
  constructor(
    private commentRepo: ICommentsRepository,
    private postRepo: IPostsRepository,
    private membersRepo: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async postComment(
    command: PostCommentCommand,
  ): Promise<Result<Comment, PostCommentError>> {
    return new PostComment(
      this.commentRepo,
      this.postRepo,
      this.membersRepo,
      this.eventBus,
    ).execute(command);
  }

  async getCommentsByPostId(
    postId: string,
  ): Promise<Result<Comment[], PostCommentError>> {
    const comments = await this.commentRepo.getCommentsByPostId(postId);
    return Result.success(comments);
  }
}
