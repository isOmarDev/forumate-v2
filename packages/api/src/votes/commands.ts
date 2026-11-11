import { fail, Result, success } from '@forumate/core/application';
import { InvalidRequestInputError } from '@forumate/errors/request';

import { validateCommandInput } from '../validate-command-input';

import {
  CastInitialUpvoteOnCommentInput,
  CastInitialUpvoteOnCommentSchema,
  CastInitialUpvoteOnPostInput,
  CastInitialUpvoteOnPostSchema,
  voteOnCommentInputSchema,
  voteOnPostInputSchema,
  type VoteOnCommentInput,
  type VoteOnPostInput,
} from './inputs';

// Vote On Comment
export class VoteOnCommentCommand {
  private constructor(public readonly props: VoteOnCommentInput) {}

  static create(
    input: unknown,
  ): Result<VoteOnCommentCommand, InvalidRequestInputError> {
    const inputOrError = validateCommandInput(voteOnCommentInputSchema, input);

    if (inputOrError.isFailure) {
      return fail(inputOrError.getError());
    }

    return success(new VoteOnCommentCommand(inputOrError.getValue()));
  }
}

// Initial Upvote On Comment
export class CastInitialUpvoteOnCommentCommand {
  private constructor(public readonly props: CastInitialUpvoteOnCommentInput) {}

  static create(
    input: unknown,
  ): Result<CastInitialUpvoteOnCommentCommand, InvalidRequestInputError> {
    const inputOrError = validateCommandInput(
      CastInitialUpvoteOnCommentSchema,
      input,
    );

    if (inputOrError.isFailure) {
      return fail(inputOrError.getError());
    }

    return success(
      new CastInitialUpvoteOnCommentCommand(inputOrError.getValue()),
    );
  }
}

// Vote On Post
export class VoteOnPostCommand {
  private constructor(public readonly props: VoteOnPostInput) {}

  static create(
    input: unknown,
  ): Result<VoteOnPostCommand, InvalidRequestInputError> {
    const inputOrError = validateCommandInput(voteOnPostInputSchema, input);

    if (inputOrError.isFailure) {
      return fail(inputOrError.getError());
    }

    return success(new VoteOnPostCommand(inputOrError.getValue()));
  }
}

// Initial Upvote On Post
export class CastInitialUpvoteOnPostCommand {
  private constructor(public readonly props: CastInitialUpvoteOnPostInput) {}

  static create(
    input: unknown,
  ): Result<CastInitialUpvoteOnPostCommand, InvalidRequestInputError> {
    const inputOrError = validateCommandInput(
      CastInitialUpvoteOnPostSchema,
      input,
    );

    if (inputOrError.isFailure) {
      return fail(inputOrError.getError());
    }

    return success(new CastInitialUpvoteOnPostCommand(inputOrError.getValue()));
  }
}
