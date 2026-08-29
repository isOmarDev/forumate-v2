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

  public getPosts = async (
    req: express.Request<
      Record<string, never>,
      unknown,
      unknown,
      GetPostsQueryInput
    >,
    res: express.Response,
  ) => {
    const query = GetPostsQuery.fromRequest(req.query);

    const result = await this.postsService.getPosts(query);
    const posts = result.map((p) => p.toDTO());

    return this.ok(res, posts);
  };

  public createPost = async (req: express.Request, res: express.Response) => {
    const command = CreatePostCommand.fromRequest(req.body);

    if (command.isFailure) {
      return this.fail(res, command.getError());
    }

    const createPostresult = await this.postsService.createPost(
      command.getValue(),
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

  public getPostById = async (req: express.Request, res: express.Response) => {
    const query = GetPostByIdQuery.fromRequest(req);

    const resultOrError = await this.postsService.getPostDetailsById(
      query.postId,
    );

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    return this.ok(res, resultOrError.getValue().toDTO());
  };
}
