import { fail, Result, success } from '@forumate/core/application';
import { InvalidRequestInputError } from '@forumate/errors/request';

import { validateCommandInput } from '../validate-command-input';

import { createPostInputSchema, type CreatePostInput } from './inputs';

export class CreatePostCommand {
  private constructor(public readonly props: CreatePostInput) {}

  static create(
    input: unknown,
  ): Result<CreatePostCommand, InvalidRequestInputError> {
    const inputOrError = validateCommandInput(createPostInputSchema, input);

    if (inputOrError.isFailure) {
      return fail(inputOrError.getError());
    }

    return success(new CreatePostCommand(inputOrError.getValue()));
  }
}
