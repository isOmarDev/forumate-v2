import { Result, success, fail } from '@forumate/core';
import { InvalidRequestInputError } from '@forumate/errors';

import { validateCommandInput } from '../validate-command-input';

import { PostCommentInput, postCommentInputSchema } from './inputs';

export class PostCommentCommand {
  private constructor(private readonly props: PostCommentInput) {}

  public getProps(): PostCommentInput {
    return this.props;
  }

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
