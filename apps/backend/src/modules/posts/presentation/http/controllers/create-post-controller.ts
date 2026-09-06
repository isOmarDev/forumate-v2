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

    const createPostresultOrError = await this.postsService.createPost(
      commandOrError.getValue(),
    );

    if (createPostresultOrError.isFailure) {
      return this.fail(res, createPostresultOrError.getError());
    }

    const newPost = createPostresultOrError.getValue();

    const postDetailsResultOrError = await this.postsService.getPostDetailsById(
      newPost.id,
    );

    if (postDetailsResultOrError.isFailure) {
      return this.fail(res, postDetailsResultOrError.getError());
    }

    return this.ok(res, postDetailsResultOrError.getValue().toDTO());
  }
}
