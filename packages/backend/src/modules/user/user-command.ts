import { InvalidRequestBodyException } from '../../shared/errors/exceptions';
import { isMissingKeys } from '../../shared/utils/utils';
import { CreateUserInput } from '@dddforum/shared/api/users';

export class CreateUserCommand {
  private constructor(public props: CreateUserInput) {}

  static validateRequest(body: unknown) {
    const requiredKeys = [
      'email',
      'username',
      'firstName',
      'lastName',
      'password',
    ];

    const isRequestInvalid =
      !body || typeof body !== 'object' || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { email, username, firstName, lastName, password } =
      body as CreateUserInput;

    return new CreateUserCommand({
      email,
      username,
      firstName,
      lastName,
      password,
    });
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
