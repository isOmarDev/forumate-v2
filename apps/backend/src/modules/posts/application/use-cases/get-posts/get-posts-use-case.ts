import { GetPostsQuery } from '@forumate/api';
import { Result, type IUseCase } from '@forumate/core';

import { PostNotFoundError } from '../../../domain/errors/posts-errors';
import type { IPostsRepository } from '../../ports/posts-repository';
import { PostReadModel } from '../../read-models/post-read-model';

export type GetPostsResponse = Result<PostReadModel[], PostNotFoundError>;

export class GetPostsUseCase implements IUseCase<
  GetPostsQuery,
  GetPostsResponse
> {
  constructor(private postsRepo: IPostsRepository) {}

  async execute(query: GetPostsQuery): Promise<GetPostsResponse> {
    const posts = await this.postsRepo.findPosts(query);
    return Result.success(posts);
  }
}
