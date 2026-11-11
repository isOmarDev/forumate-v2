import {
  GetCommentsByPostIdQuery,
  PostCommentCommand,
} from '@forumate/api/comments';
import { IEventBus } from '@forumate/bus';

import type { IMembersRepository } from '../../members/application/ports/members-repository';
import type { IPostsRepository } from '../../posts/application/ports/posts-repository';

import type { ICommentsReadRepository, ICommentsRepository } from './ports';
import { GetCommentsByPostIdUseCase, PostCommentUseCase } from './use-cases';

export class CommentsService {
  constructor(
    private commentsRepository: ICommentsRepository,
    private commentsReadRepository: ICommentsReadRepository,
    private postsRepository: IPostsRepository,
    private membersRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async postComment(command: PostCommentCommand) {
    return new PostCommentUseCase(
      this.commentsRepository,
      this.postsRepository,
      this.membersRepository,
      this.eventBus,
    ).execute(command);
  }

  async getCommentsByPostId(query: GetCommentsByPostIdQuery) {
    return new GetCommentsByPostIdUseCase(
      this.commentsRepository,
      this.postsRepository,
    ).execute(query);
  }
}
