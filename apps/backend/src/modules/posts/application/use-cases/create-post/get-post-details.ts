import { Result, success, type IUseCase } from '@forumate/core';

import { PostNotFoundError } from '../../../posts-errors';
import { IPostsRepository } from '../../../repos/ports/posts-repository';
import { PostReadModel } from '../../read-models/post-read-model';

export type GetPostDetailsResponse = Result<PostReadModel, PostNotFoundError>;

export class GetPostDetails implements IUseCase<
  string,
  GetPostDetailsResponse
> {
  constructor(private postsRepo: IPostsRepository) {}

  async execute(id: string): Promise<GetPostDetailsResponse> {
    const post = await this.postsRepo.getPostDetailsById(id);

    if (post === null) {
      return Result.failure(new PostNotFoundError());
    }

    return Result.success(post);
  }
}
