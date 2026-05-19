export class EmailAlreadyInUseException extends Error {
  constructor() {
    super(`Email is already in use.`);
  }
}

export class UsernameAlreadyTakenException extends Error {
  constructor() {
    super(`Username is already taken.`);
  }
}

export class UserNotFoundException extends Error {
  constructor(email: string) {
    super(`User with email ${email} not found`);
  }
}
