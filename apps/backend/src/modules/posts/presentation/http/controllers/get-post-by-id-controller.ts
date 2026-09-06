import express from 'express';

import { GetPostByIdQuery } from '@forumate/api/posts';

import { BaseController } from '../../../../../shared/infra/http';
import { PostsService } from '../../../application/posts-service';

export class GetPostByIdController extends BaseController {
  constructor(private postsService: PostsService) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response) {
    const queryOrError = GetPostByIdQuery.create(req);

    if (queryOrError.isFailure) {
      return this.fail(res, queryOrError.getError());
    }

    const postId = queryOrError.getValue().postId;
    const resultOrError = await this.postsService.getPostDetailsById(postId);

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    return this.ok(res, resultOrError.getValue().toDTO());
  }
}
