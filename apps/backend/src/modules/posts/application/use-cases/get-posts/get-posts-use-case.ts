import { GetPostsQuery } from '@forumate/api';
import { Result, type IUseCase } from '@forumate/core';

import { PostNotFoundError } from '../../../domain/errors/posts-errors';
import { IFindPostsQuery } from '../../ports';
import { PostReadModel } from '../../read-models/post-read-model';

export type GetPostsResponse = Result<PostReadModel[], PostNotFoundError>;

export class GetPostsUseCase implements IUseCase<
  GetPostsQuery,
  GetPostsResponse
> {
  constructor(private postsRepository: IFindPostsQuery) {}

  async execute(query: GetPostsQuery): Promise<GetPostsResponse> {
    const posts = await this.postsRepository.findPosts(query);
    return Result.success(posts);
  }
}
