import {
  CreatePostCommand,
  GetPostByIdQuery,
  GetPostsQuery,
} from '@forumate/api/posts';
import { IEventBus } from '@forumate/bus';

import type { IMembersRepository } from '../../members/application/ports/members-repository';

import type { IPostsRepository } from './ports/posts-repository';
import {
  CreatePostUseCase,
  GetPostByIdUseCase,
  GetPostDetailsByIdUseCase,
  GetPostsUseCase,
} from './use-cases';

export class PostsService {
  constructor(
    private postsRepo: IPostsRepository,
    private membersRepo: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async createPost(command: CreatePostCommand) {
    return new CreatePostUseCase(
      this.postsRepo,
      this.membersRepo,
      this.eventBus,
    ).execute(command);
  }

  async getPosts(query: GetPostsQuery) {
    return new GetPostsUseCase(this.postsRepo).execute(query);
  }

  async getPostById(query: GetPostByIdQuery) {
    return new GetPostByIdUseCase(this.postsRepo).execute(query);
  }

  async getPostDetailsById(id: string) {
    return new GetPostDetailsByIdUseCase(this.postsRepo).execute(id);
  }
}
