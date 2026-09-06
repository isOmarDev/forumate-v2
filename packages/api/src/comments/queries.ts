import { fail, Result, success } from '@forumate/core/application';
import { InvalidRequestQueryParamsError } from '@forumate/errors/request';

import { validateQueryInput } from '../validate-query-input';

import {
  GetCommentsByPostIdQueryInput,
  getCommentsByPostIdQueryInputSchema,
} from './inputs';

export class GetCommentsByPostIdQuery {
  private constructor(private readonly props: GetCommentsByPostIdQueryInput) {}

  get postId() {
    return this.props.postId;
  }

  static create(
    input: unknown,
  ): Result<GetCommentsByPostIdQuery, InvalidRequestQueryParamsError> {
    const inputResult = validateQueryInput(
      getCommentsByPostIdQueryInputSchema,
      input,
    );

    if (inputResult.isFailure) {
      return fail(inputResult.getError());
    }

    return success(new GetCommentsByPostIdQuery(inputResult.getValue()));
  }
}
