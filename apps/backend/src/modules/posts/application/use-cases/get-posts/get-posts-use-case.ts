import { GetPostsQuery } from '@forumate/api';
import { Result, type IUseCase } from '@forumate/core';

import { PostNotFoundError } from '../../../domain/errors/posts-errors';
import { IPostsReadRepository } from '../../ports/posts-read-repository';
import { PostReadModel } from '../../read-models/post-read-model';

export type GetPostsResponse = Result<PostReadModel[], PostNotFoundError>;

export class GetPostsUseCase implements IUseCase<
  GetPostsQuery,
  GetPostsResponse
> {
  constructor(private postsReadRepository: IPostsReadRepository) {}

  async execute(query: GetPostsQuery): Promise<GetPostsResponse> {
    const posts = await this.postsReadRepository.findPosts(query);
    return Result.success(posts);
  }
}
