import { fail, Result, success } from '@forumate/core/application';
import { InvalidRequestInputError } from '@forumate/errors/request';

import { validateCommandInput } from '../validate-command-input';

import {
  voteOnCommentInputSchema,
  voteOnPostInputSchema,
  type VoteOnCommentInput,
  type VoteOnPostInput,
} from './inputs';

// Update Member Reputation
export class UpdateMemberReputationScoreCommand {
  constructor(
    public readonly props: {
      memberId: string;
    },
  ) {}
}

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
