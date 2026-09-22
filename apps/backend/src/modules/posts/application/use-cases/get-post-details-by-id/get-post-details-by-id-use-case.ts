import { Result, type IUseCase } from '@forumate/core';

import { PostNotFoundError } from '../../../domain/errors/posts-errors';
import { IGetPostDetailsByIdQuery } from '../../ports';
import { PostReadModel } from '../../read-models/post-read-model';

export type GetPostDetailsByIdResponse = Result<
  PostReadModel,
  PostNotFoundError
>;

export class GetPostDetailsByIdUseCase implements IUseCase<
  string,
  GetPostDetailsByIdResponse
> {
  constructor(private postsRepository: IGetPostDetailsByIdQuery) {}

  async execute(id: string): Promise<GetPostDetailsByIdResponse> {
    const post = await this.postsRepository.getPostDetailsById(id);

    if (!post) {
      return Result.failure(new PostNotFoundError());
    }

    return Result.success(post);
  }
}
