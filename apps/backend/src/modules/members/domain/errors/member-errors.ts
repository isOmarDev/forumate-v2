import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '@forumate/errors/application';
import { memberErrorCodes } from '@forumate/errors/domain';

export class InvalidMemberUsernameError extends ValidationError {
  readonly code = memberErrorCodes.INVALID_MEMBER_USERNAME;

  constructor(message: string) {
    super(message);
  }
}

export class MemberNotFoundError extends NotFoundError {
  readonly code = memberErrorCodes.MEMBER_NOT_FOUND;

  constructor() {
    super('Member not found');
  }
}

export class InsufficientMemberLevelError extends ForbiddenError {
  readonly code = memberErrorCodes.INSUFFICIENT_MEMBER_LEVEL;

  constructor() {
    super('You do not have permission to create a post.');
  }
}
