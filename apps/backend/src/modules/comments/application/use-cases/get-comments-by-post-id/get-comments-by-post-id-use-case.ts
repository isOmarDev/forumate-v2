import { GetCommentsByPostIdQuery } from '@forumate/api';
import { type IUseCase, Result, success, fail } from '@forumate/core';

import type { IPostsRepository } from '../../../../posts/application/ports/posts-repository';
import { PostNotFoundError } from '../../../../posts/domain/errors/posts-errors';
import { Comment } from '../../../domain/entities/comment';
import type { ICommentsRepository } from '../../ports/comments-repository';

export type GetCommentsByPostIdResponse = Result<Comment[], PostNotFoundError>;

export class GetCommentsByPostIdUseCase implements IUseCase<
  GetCommentsByPostIdQuery,
  GetCommentsByPostIdResponse
> {
  constructor(
    private commentsRepository: ICommentsRepository,
    private postsRepository: IPostsRepository,
  ) {}

  async execute(
    query: GetCommentsByPostIdQuery,
  ): Promise<GetCommentsByPostIdResponse> {
    const post = await this.postsRepository.getPostById(query.postId);

    if (!post) {
      return fail(new PostNotFoundError());
    }

    const comments = await this.commentsRepository.getCommentsByPostId(
      query.postId,
    );

    return success(comments);
  }
}
