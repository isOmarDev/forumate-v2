import { CommentRepository } from '../repos/ports/comment-repository';
import {
  PostComment,
  PostCommentError,
} from './use-cases/post-comment/post-comment';
import { Comment } from '../domain/comment';
import { PostsRepository } from '../../posts/repos/ports/posts-repository';
import { MembersRepository } from '../../members/repos/ports/members-repository';
import { Result } from '@forumate/core';
import { PostCommentCommand } from '@forumate/api';
import { EventBus } from '@forumate/bus';

export class CommentsService {
  constructor(
    private commentRepo: CommentRepository,
    private postRepo: PostsRepository,
    private membersRepo: MembersRepository,
    private eventBus: EventBus,
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
