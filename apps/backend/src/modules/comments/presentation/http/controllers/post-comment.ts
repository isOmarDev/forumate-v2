import express from 'express';

import { PostCommentCommand } from '@forumate/api/comments';

import { BaseController } from '../../../../../shared/infra/http';
import { CommentsService } from '../../../application/comments-service';

export class PostComment extends BaseController {
  constructor(private commentsService: CommentsService) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response) {
    const commandOrError = PostCommentCommand.create(req.body);

    if (commandOrError.isFailure) {
      return this.fail(res, commandOrError.getError());
    }

    const resultOrError = await this.commentsService.postComment(
      commandOrError.getValue(),
    );

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    return this.created(res, resultOrError.getValue());
  }
}
