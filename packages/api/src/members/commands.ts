import { fail, Result, success } from '@forumate/core';
import { InvalidRequestInputError } from '@forumate/errors/request';

import { validateCommandInput } from '../validate-command-input';

import { CreateMemberInput, createMemberInputSchema } from './inputs';

export class CreateMemberCommand {
  private constructor(readonly props: CreateMemberInput) {}

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
