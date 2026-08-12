import { Result, TextUtil, fail, success } from '@forumate/core';
import { InvalidRequestBodyError } from '@forumate/errors/server';
import { ValidationError } from '@forumate/errors/application';

import { CreateUserInput } from './inputs';

export class CreateUserCommand {
  private constructor(public props: CreateUserInput) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ['email', 'firstName', 'lastName', 'username'];
    const isRequestInvalid =
      !body ||
      typeof body !== 'object' ||
      TextUtil.isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyError(requiredKeys);
    }

    const input = body as CreateUserInput;

    return CreateUserCommand.create(input);
  }

  static create(
    props: CreateUserInput,
  ): Result<CreateUserCommand, ValidationError> {
    const isEmailValid = props.email.indexOf('@') !== -1;
    const isFirstNameValid = TextUtil.isBetweenLength(props.firstName, 2, 16);
    const isLastNameValid = TextUtil.isBetweenLength(props.lastName, 2, 25);
    const isUsernameValid = TextUtil.isBetweenLength(props.username, 2, 25);

    if (
      !isEmailValid ||
      !isFirstNameValid ||
      !isLastNameValid ||
      !isUsernameValid
    ) {
      return fail(new ValidationError());
    }

    const { username, email, firstName, lastName } = props;

    return success(
      new CreateUserCommand({ email, firstName, lastName, username }),
    );
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
}