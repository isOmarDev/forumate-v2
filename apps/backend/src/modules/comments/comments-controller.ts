import express from 'express';

import { PostCommentCommand } from '@forumate/api';

import { BaseController } from '../../shared/infra/http';

import { CommentsService } from './application/comments-service';

export class CommentsController extends BaseController {
  constructor(private commentsService: CommentsService) {
    super();
  }

  public getCommentsByPostId = async (
    req: express.Request,
    res: express.Response,
  ) => {
    const postId = req.params.postId;

    const resultOrError = await this.commentsService.getCommentsByPostId(
      postId as string,
    );

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    return this.ok(res, resultOrError.getValue());
  };

  public postComment = async (req: express.Request, res: express.Response) => {
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
  };
}
