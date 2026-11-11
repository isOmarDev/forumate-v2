import { Result, success, fail } from '@forumate/core';
import { InvalidRequestInputError } from '@forumate/errors';

import { validateCommandInput } from '../validate-command-input';

import { PostCommentInput, postCommentInputSchema } from './inputs';

export class PostCommentCommand {
  private constructor(public readonly props: PostCommentInput) {}

  static create(
    input: unknown,
    // decodedToken: DecodedIdToken | undefined,
  ): Result<PostCommentCommand, InvalidRequestInputError> {
    const inputOrError = validateCommandInput(postCommentInputSchema, input);

    if (inputOrError.isFailure) {
      return fail(inputOrError.getError());
    }

    return success(new PostCommentCommand(inputOrError.getValue()));
  }
}
