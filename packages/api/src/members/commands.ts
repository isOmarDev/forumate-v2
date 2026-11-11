import { fail, Result, success } from '@forumate/core';
import { InvalidRequestInputError } from '@forumate/errors/request';

import { validateCommandInput } from '../validate-command-input';

import {
  CreateMemberInput,
  createMemberInputSchema,
  UpdateMemberReputationInput,
  updateMemberReputationInputSchema,
} from './inputs';

// Create Member
export class CreateMemberCommand {
  private constructor(public readonly props: CreateMemberInput) {}

  static create(
    input: unknown,
  ): Result<CreateMemberCommand, InvalidRequestInputError> {
    const inputOrError = validateCommandInput(createMemberInputSchema, input);

    if (inputOrError.isFailure) {
      return fail(inputOrError.getError());
    }

    return success(new CreateMemberCommand(inputOrError.getValue()));
  }
}

// Update Member Reputation
export class UpdateMemberReputationCommand {
  private constructor(public readonly props: UpdateMemberReputationInput) {}

  static create(
    input: unknown,
  ): Result<UpdateMemberReputationCommand, InvalidRequestInputError> {
    const inputOrError = validateCommandInput(
      updateMemberReputationInputSchema,
      input,
    );

    if (inputOrError.isFailure) {
      return fail(inputOrError.getError());
    }

    return success(new UpdateMemberReputationCommand(inputOrError.getValue()));
  }
}
