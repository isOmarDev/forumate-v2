import { fail, success, type Result } from '@forumate/core/application';
import { InvalidRequestQueryParamsError } from '@forumate/errors/request';

import { validateQueryInput } from '../validate-query-input';

import {
  GetPostByIdQueryInput,
  getPostByIdQueryInputSchema,
  getPostsQueryInputSchema,
  type GetPostsQueryInput,
  type GetPostsQueryOption,
} from './inputs';

// Get Post By ID

export class GetPostByIdQuery {
  private constructor(private readonly props: GetPostByIdQueryInput) {}

  get postId() {
    return this.props.postId;
  }

  static create(
    input: unknown,
  ): Result<GetPostByIdQuery, InvalidRequestQueryParamsError> {
    const inputResult = validateQueryInput(getPostByIdQueryInputSchema, input);

    if (inputResult.isFailure) {
      return fail(inputResult.getError());
    }

    return success(new GetPostByIdQuery(inputResult.getValue()));
  }
}

// Get Posts
export class GetPostsQuery {
  constructor(private readonly props: GetPostsQueryInput) {}

  static create(
    input: unknown,
  ): Result<GetPostsQuery, InvalidRequestQueryParamsError> {
    const queryOrError = validateQueryInput(getPostsQueryInputSchema, input);

    if (queryOrError.isFailure) {
      return fail(queryOrError.getError());
    }

    return success(new GetPostsQuery(queryOrError.getValue()));
  }

  get sort(): GetPostsQueryOption {
    return this.props.sort;
  }
}
