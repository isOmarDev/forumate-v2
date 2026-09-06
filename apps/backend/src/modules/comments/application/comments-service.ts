import {
  GetCommentsByPostIdQuery,
  PostCommentCommand,
} from '@forumate/api/comments';
import { IEventBus } from '@forumate/bus';
import { Result } from '@forumate/core';

import type { IMembersRepository } from '../../members/application/ports/members-repository';
import type { IPostsRepository } from '../../posts/application/ports/posts-repository';
import { Comment } from '../domain/entities/comment';

import type { ICommentsRepository } from './ports/comments-repository';
import { GetCommentsByPostIdUseCase, PostCommentUseCase } from './use-cases';

export class CommentsService {
  constructor(
    private commentRepo: ICommentsRepository,
    private postRepo: IPostsRepository,
    private membersRepo: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async postComment(command: PostCommentCommand) {
    return new PostCommentUseCase(
      this.commentRepo,
      this.postRepo,
      this.membersRepo,
      this.eventBus,
    ).execute(command);
  }

  async getCommentsByPostId(query: GetCommentsByPostIdQuery) {
    return new GetCommentsByPostIdUseCase(
      this.commentRepo,
      this.postRepo,
    ).execute(query);
  }
}
