import { fail, Result, success } from '@forumate/core/application';
import { InvalidRequestInputError } from '@forumate/errors/request';

import { validateCommandInput } from '../validate-command-input';

import { AddEmailToListInput, addEmailToListSchema } from './inputs';

export class AddEmailToListCommand {
  private constructor(readonly props: AddEmailToListInput) {}

  static create(
    input: unknown,
  ): Result<AddEmailToListCommand, InvalidRequestInputError> {
    const inputOrError = validateCommandInput(addEmailToListSchema, input);

    if (inputOrError.isFailure) {
      return fail(inputOrError.getError());
    }

    return success(new AddEmailToListCommand(inputOrError.getValue()));
  }

  get email() {
    return this.props.email;
  }
}
