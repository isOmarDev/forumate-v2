import { ConflictError, NotFoundError } from '@forumate/errors/application';

// TODO: Oh, this is where you can override the errors and return more specific errors
// TODO: set it up so that you can do this in each of the classes, because that's pretty cool.
class EmailAlreadyInUseException extends ConflictError {
  constructor(email: string) {
    super('user', `Email ${email} is already in use`);
  }
}

// TODO: Move these to members
class UsernameAlreadyTakenException extends ConflictError {
  constructor(username: string) {
    super('user', `Username ${username} is already taken`);
  }
}

class UserNotFoundException extends NotFoundError {
  constructor(email: string) {
    super('user', `User with email ${email} not found`);
  }
}

export {
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
  UserNotFoundException,
};
