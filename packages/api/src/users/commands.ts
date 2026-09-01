import { Result, success, fail } from '@forumate/core/application';
import { InvalidRequestInputError } from '@forumate/errors/request';

import { validateCommandInput } from '../validate-command-input';

import { createUserInputSchema, type CreateUserInput } from './inputs';

export class CreateUserCommand {
  private constructor(public props: CreateUserInput) {}

  static create(
    input: unknown,
  ): Result<CreateUserCommand, InvalidRequestInputError> {
    const inputOrError = validateCommandInput(createUserInputSchema, input);

    if (inputOrError.isFailure) {
      return fail(inputOrError.getError());
    }

    return success(new CreateUserCommand(inputOrError.getValue()));
  }
}
