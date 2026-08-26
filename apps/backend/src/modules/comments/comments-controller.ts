import express from 'express';

import { PostCommentCommand } from '@forumate/api';

import { ErrorHandler } from '../../shared/errors';

import { CommentsService } from './application/comments-service';

export class CommentsController {
  private router: express.Router;

  constructor(
    private commentsService: CommentsService,
    private errorHandler: ErrorHandler,
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.get(
      '/posts/:postId/comments',
      this.getCommentsByPostId.bind(this),
    );
    this.router.post('/posts/:postId/comments', this.postComment.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async getCommentsByPostId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const postId = req.params.postId;
      const result = await this.commentsService.getCommentsByPostId(
        postId as string,
      );

      return result.match({
        success: (value) =>
          res.json({
            success: true,
            data: value,
            error: null,
          }),
        failure: (error) =>
          res.status(404).json({
            success: false,
            data: null,
            error,
          }),
      });
    } catch (error) {
      next(error);
    }
  }

  private async postComment(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const commandOrError = PostCommentCommand.fromRequest(req.body, req.user);

      if (commandOrError.isFailure) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Missing required parameters',
            code: 'MISSING_PARAMS',
          },
        });
      }

      const result = await this.commentsService.postComment(
        commandOrError.getValue(),
      );

      return result.match({
        success: (comment) =>
          res.json({
            success: true,
            data: comment,
          }),
        failure: (error) => {
          if (error instanceof Error && error.name === 'PostNotFound') {
            return res.status(404).json({
              success: false,
              error: {
                message: 'Post not found',
                code: 'POST_NOT_FOUND',
              },
            });
          }
          return res.status(400).json({
            success: false,
            error: {
              message: 'Invalid comment',
              code: 'INVALID_COMMENT',
            },
          });
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
