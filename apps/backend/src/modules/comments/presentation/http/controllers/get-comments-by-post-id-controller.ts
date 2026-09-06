import express from 'express';

import { GetCommentsByPostIdQuery } from '@forumate/api';

import { BaseController } from '../../../../../shared/infra/http';
import { CommentsService } from '../../../application/comments-service';

export class GetCommentsByPostIdController extends BaseController {
  constructor(private commentsService: CommentsService) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response) {
    const paramsOrError = GetCommentsByPostIdQuery.create(req.params);

    if (paramsOrError.isFailure) {
      this.fail(res, paramsOrError.getError());
    }

    const resultOrError = await this.commentsService.getCommentsByPostId(
      paramsOrError.getValue(),
    );

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    this.ok(res, resultOrError.getValue());
  }
}
