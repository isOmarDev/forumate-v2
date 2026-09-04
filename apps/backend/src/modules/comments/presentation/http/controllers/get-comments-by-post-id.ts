import express from 'express';

import { BaseController } from '../../../../../shared/infra/http';
import { CommentsService } from '../../../application/comments-service';

export class GetCommentsByPostId extends BaseController {
  constructor(private commentsService: CommentsService) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response) {
    const postId = req.params.postId;

    const resultOrError = await this.commentsService.getCommentsByPostId(
      postId as string,
    );

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    this.ok(res, resultOrError.getValue());
  }
}
