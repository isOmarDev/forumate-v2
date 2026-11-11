import express from 'express';

import { CreatePostCommand } from '@forumate/api/posts';

import { BaseController } from '../../../../../shared/infra/http';
import { PostsService } from '../../../application/posts-service';

export class CreatePostController extends BaseController {
  constructor(private postsService: PostsService) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response) {
    const commandOrError = CreatePostCommand.create(req.body);

    if (commandOrError.isFailure) {
      return this.fail(res, commandOrError.getError());
    }

    const resultOrError = await this.postsService.createPost(
      commandOrError.getValue(),
    );

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    const post = resultOrError.getValue();

    return this.created(res, { id: post.id, slug: post.slug.value });
  }
}
