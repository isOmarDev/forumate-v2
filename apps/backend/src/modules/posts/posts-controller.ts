import express from 'express';

import {
  CreatePostCommand,
  GetPostByIdQuery,
  GetPostsQuery,
  GetPostsQueryInput,
} from '@forumate/api';

import { BaseController } from '../../shared/infra/http';

import { PostsService } from './application/posts-service';

export class PostsController extends BaseController {
  constructor(private postsService: PostsService) {
    super();
  }

  public createPost = async (req: express.Request, res: express.Response) => {
    const commandOrError = CreatePostCommand.create(req.body);

    if (commandOrError.isFailure) {
      return this.fail(res, commandOrError.getError());
    }

    const createPostresult = await this.postsService.createPost(
      commandOrError.getValue(),
    );

    if (createPostresult.isFailure) {
      return this.fail(res, createPostresult.getError());
    }

    const newPost = createPostresult.getValue();

    const postDetailsResult = await this.postsService.getPostDetailsById(
      newPost.id,
    );

    if (postDetailsResult.isFailure) {
      return this.fail(res, postDetailsResult.getError());
    }

    return this.ok(res, postDetailsResult.getValue().toDTO());
  };

  public getPosts = async (
    req: express.Request<
      Record<string, never>,
      unknown,
      unknown,
      GetPostsQueryInput
    >,
    res: express.Response,
  ) => {
    const queryOrError = GetPostsQuery.create(req.query);

    if (queryOrError.isFailure) {
      return this.fail(res, queryOrError.getError());
    }

    const result = await this.postsService.getPosts(queryOrError.getValue());
    const posts = result.map((p) => p.toDTO());

    return this.ok(res, posts);
  };

  public getPostById = async (req: express.Request, res: express.Response) => {
    const queryOrError = GetPostByIdQuery.create(req);

    if (queryOrError.isFailure) {
      return this.fail(res, queryOrError.getError());
    }

    const postId = queryOrError.getValue().postId;
    const resultOrError = await this.postsService.getPostDetailsById(postId);

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    return this.ok(res, resultOrError.getValue().toDTO());
  };
}
