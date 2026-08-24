import express from 'express';

import {
  CreatePostApiResponse,
  CreatePostCommand,
  GetPostByIdApiResponse,
  GetPostByIdQuery,
  GetPostsApiResponse,
  GetPostsQuery,
} from '@forumate/api';

import { ErrorHandler } from '../../shared/errors';

import { PostsService } from './application/posts-service';

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
        success: true,
        data: posts.map((post) => post.toDTO()),
        statusCode: 200,
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
        success: true,
        data: postDetails!.toDTO(),
        statusCode: 200,
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
          statusCode: 404,
          error: {
            code: 'PostNotFound',
            message: 'Post not found.',
          },
        });
      } else {
        const response: GetPostByIdApiResponse = {
          success: true,
          data: postOrNothing.toDTO(),
          statusCode: 200,
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
