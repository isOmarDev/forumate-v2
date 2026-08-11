import express from 'express';

import { ErrorHandler } from '../../shared/errors';
import { PostsService } from './application/posts-service';
import {
  CreatePostApiResponse,
  CreatePostCommand,
  GetPostByIdApiResponse,
  GetPostByIdQuery,
  GetPostsApiResponse,
  GetPostsQuery,
} from '@forumate/api';

export class PostsController {
  private router: express.Router;

  constructor(
    private postsService: PostsService,
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
    this.router.get('/', this.getPosts.bind(this));
    this.router.post('/new', this.createPost.bind(this));
    this.router.get('/:postId', this.getPostById.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async getPosts(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const query = GetPostsQuery.fromRequest(req.query);
      const posts = await this.postsService.getPosts(query);

      const response: GetPostsApiResponse = {
        data: posts.map((p) => p.toDTO()),
        success: true,
        error: null,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async createPost(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const commandOrError = CreatePostCommand.fromRequest(req.body);
      if (!commandOrError.isSuccess()) {
        return next(commandOrError.getError());
      }

      const result = await this.postsService.createPost(
        commandOrError.getValue(),
      );
      if (!result.isSuccess()) {
        return next(result.getError());
      }

      const newPost = result.getValue();
      const postDetails = await this.postsService.getPostDetailsById(
        newPost.id,
      );

      const response: CreatePostApiResponse = {
        data: postDetails?.toDTO(),
        success: true,
        error: null,
      };

      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  private async getPostById(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const query = GetPostByIdQuery.fromRequest(req);
      const postOrNothing = await this.postsService.getPostDetailsById(
        query.postId,
      );

      if (postOrNothing === null) {
        // Improvement: Handle these consistently and with strict types
        return res.status(404).json({
          success: false,
          data: undefined,
          error: {
            code: 'PostNotFound',
            message: 'Post not found.',
          },
        });
      } else {
        const response: GetPostByIdApiResponse = {
          data: postOrNothing.toDTO(),
          success: true,
          error: null,
        };
        // Improvement: Handle these consistently and with strict types
        return res.status(200).json(response);
      }
    } catch (error) {
      next(error);
    }
  }
}
