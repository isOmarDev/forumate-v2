import { Result, success, fail } from '@forumate/core/application';
import { TextUtil } from '@forumate/core/utils';
import {
  InvalidInputError,
  InvalidRequestBodyError,
  MissingRequestBodyError,
} from '@forumate/errors/request';

import type { CreateUserInput } from './inputs';

export class CreateUserCommand {
  private constructor(public props: CreateUserInput) {}

  static fromRequest(
    body: unknown,
  ): Result<CreateUserCommand, InvalidInputError | InvalidRequestBodyError> {
    if (!TextUtil.isObject<CreateUserInput>(body)) {
      throw new MissingRequestBodyError();
    }

    const requiredKeys = [
      'email',
      'firstName',
      'lastName',
      'username',
      'password',
    ];

    const missingKeys = TextUtil.getMissingKeys(body, requiredKeys);

    if (missingKeys.length > 0) {
      return fail(new InvalidRequestBodyError(missingKeys));
    }

    return CreateUserCommand.create(body);
  }

  static create(
    props: CreateUserInput,
  ): Result<CreateUserCommand, InvalidInputError> {
    const validations = {
      email: props.email.includes('@'),
      firstName: TextUtil.isBetweenLength(props.firstName, 2, 16),
      lastName: TextUtil.isBetweenLength(props.lastName, 2, 25),
      username: TextUtil.isBetweenLength(props.username, 2, 25),
    };

    const invalidFields = Object.entries(validations)
      .filter(([, isValid]) => !isValid)
      .map(([field]) => field);

    if (invalidFields.length > 0) {
      return fail(new InvalidInputError(invalidFields));
    }

    return success(new CreateUserCommand(props));
  }

  get email() {
    return this.props.email;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get username() {
    return this.props.username;
  }

  get password() {
    return this.props.password;
  }
}
