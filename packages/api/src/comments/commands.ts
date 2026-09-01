import { Result, success, fail } from '@forumate/core';
import { InvalidRequestInputError } from '@forumate/errors';

import { validateCommandInput } from '../validate-command-input';

import { CreateCommentInput, createCommentInputSchema } from './inputs';

export class PostCommentCommand {
  private constructor(public readonly props: CreateCommentInput) {}

  static create(
    input: unknown,
    // decodedToken: DecodedIdToken | undefined,
  ): Result<PostCommentCommand, InvalidRequestInputError> {
    const inputOrError = validateCommandInput(createCommentInputSchema, input);

    if (inputOrError.isFailure) {
      return fail(inputOrError.getError());
    }

    return success(new PostCommentCommand(inputOrError.getValue()));
  }
}
