import {
  CreatePostCommand,
  GetPostByIdQuery,
  GetPostsQuery,
} from '@forumate/api/posts';
import { IEventBus } from '@forumate/bus';

import type { IMembersRepository } from '../../members/application/ports/members-repository';

import { IPostsQueries } from './ports';
import type { IPostsRepository } from './ports/posts-repository';
import {
  CreatePostUseCase,
  GetPostByIdUseCase,
  GetPostDetailsByIdUseCase,
  GetPostsUseCase,
} from './use-cases';

export class PostsService {
  constructor(
    private postsRepository: IPostsRepository & IPostsQueries,
    private membersRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async createPost(command: CreatePostCommand) {
    return new CreatePostUseCase(
      this.postsRepository,
      this.membersRepository,
      this.eventBus,
    ).execute(command);
  }

  async getPosts(query: GetPostsQuery) {
    return new GetPostsUseCase(this.postsRepository).execute(query);
  }

  async getPostById(query: GetPostByIdQuery) {
    return new GetPostByIdUseCase(this.postsRepository).execute(query);
  }

  async getPostDetailsById(id: string) {
    return new GetPostDetailsByIdUseCase(this.postsRepository).execute(id);
  }
}
