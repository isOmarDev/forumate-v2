import { type Request } from '@forumate/core/application';
import {
  InvalidRequestQueryParamsError,
  MissingRequestQueryParamsError,
} from '@forumate/errors/request';

import type { GetPostsQueryInput, GetPostsQueryOption } from './inputs';

// Get Post By ID
export class GetPostByIdQuery {
  constructor(
    private readonly props: {
      postId: string;
    },
  ) {}

  static fromRequest(
    req: Request<unknown, { postId?: string }, { postId?: string }>,
  ): GetPostByIdQuery {
    const postId = req.query.postId ?? req.params.postId;

    if (!postId) {
      throw new MissingRequestQueryParamsError(['postId']);
    }

    return new GetPostByIdQuery({
      postId: postId,
    });
  }

  get postId(): string {
    return this.props.postId;
  }
}

// Get Posts
export class GetPostsQuery {
  constructor(private readonly props: GetPostsQueryInput) {}

  static create(option: GetPostsQueryOption): GetPostsQuery {
    return new GetPostsQuery({
      sort: option,
    });
  }

  static fromRequest(
    query: Request<unknown, GetPostsQueryInput>['query'],
  ): GetPostsQuery {
    const { sort } = query;

    if (!sort) {
      throw new MissingRequestQueryParamsError(['sort']);
    }

    if (sort !== 'recent' && sort !== 'popular') {
      throw new InvalidRequestQueryParamsError(['sort']);
    }

    return new GetPostsQuery({
      sort,
    });
  }

  get sort(): GetPostsQueryOption {
    return this.props.sort;
  }
}
