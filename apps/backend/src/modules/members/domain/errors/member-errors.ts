import { ValidationError, NotFoundError } from '@forumate/errors/application';
import { memberErrorCodes } from '@forumate/errors/domain';

export class InvalidMemberUsernameError extends ValidationError {
  readonly code = memberErrorCodes.INVALID_MEMBER_USERNAME;

  constructor() {
    super('Member username is invalid');
  }
}

export class MemberNotFoundError extends NotFoundError {
  readonly code = memberErrorCodes.MEMBER_NOT_FOUND;

  constructor() {
    super('Member not found');
  }
}
