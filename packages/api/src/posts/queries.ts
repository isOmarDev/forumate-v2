import { Request } from '@forumate/core';
import {
  InvalidRequestParamsError,
  MissingRequestParamsError,
} from '@forumate/errors/server';

export class GetPostByIdQuery {
  constructor(private props: { postId: string }) {}

  static fromRequest(req: Request) {
    const postId = req['query'].postId || req['params'].postId;

    if (!postId) {
      throw new MissingRequestParamsError(['postId']);
    }

    return new GetPostByIdQuery({ postId: postId as string });
  }

  get postId() {
    return this.props.postId;
  }
}

export type GetPostsQueryOption = 'popular' | 'recent';
export type GetPostsQueryInput = { sort: GetPostsQueryOption };
export class GetPostsQuery {
  constructor(private props: GetPostsQueryInput) {}

  public static create(option: GetPostsQueryOption) {
    return new GetPostsQuery({ sort: option });
  }

  static fromRequest(query: Request['query']) {
    const { sort } = query;

    if (!sort) {
      throw new MissingRequestParamsError(['sort']);
    }

    if (sort !== 'recent' && sort !== 'popular') {
      throw new InvalidRequestParamsError(['sort']);
    }

    return new GetPostsQuery({ sort });
  }

  get sort() {
    return this.props.sort;
  }
}
