import express from 'express';

import { GetPostsQuery } from '@forumate/api/posts';

import { BaseController } from '../../../../../shared/infra/http';
import { PostsService } from '../../../application/posts-service';

export class GetPostsController extends BaseController {
  constructor(private postsService: PostsService) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response) {
    const queryOrError = GetPostsQuery.create(req.query);

    if (queryOrError.isFailure) {
      return this.fail(res, queryOrError.getError());
    }

    const resultOrError = await this.postsService.getPosts(
      queryOrError.getValue(),
    );

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    const posts = resultOrError.getValue().map((p) => p.toDTO());

    return this.ok(res, posts);
  }
}
