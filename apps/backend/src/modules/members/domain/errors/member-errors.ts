import {
  ValidationError,
  ForbiddenError,
  ConflictError,
  NotFoundError,
} from '@forumate/errors/application';
import { memberErrorCodes } from '@forumate/errors/domain';

import { ReputationLevel } from '../value-objects/member-reputation-level';

export class InvalidMemberUsernameError extends ValidationError {
  readonly code = memberErrorCodes.INVALID_MEMBER_USERNAME;

  constructor(message: string) {
    super(message);
  }
}

export class InsufficientMemberLevelError extends ForbiddenError {
  readonly code = memberErrorCodes.INSUFFICIENT_MEMBER_LEVEL;

  constructor(
    message: string = 'Member level is insufficient for this action.',
  ) {
    super(message);
  }
}

export class MemberAlreadyExistsError extends ConflictError {
  readonly code = memberErrorCodes.MEMBER_ALREADY_EXISTS;

  constructor() {
    super('A member already exists for this user.');
  }
}

export class MemberUsernameAlreadyExistsError extends ConflictError {
  readonly code = memberErrorCodes.MEMBER_USERNAME_ALREADY_EXISTS;

  constructor() {
    super('This username is already taken.');
  }
}

export class InvalidReputationLevelError extends ConflictError {
  readonly code = memberErrorCodes.INVALID_REPUTITION_LEVEL;

  constructor(value: ReputationLevel) {
    super(`Invalid reputation level: ${value}`);
  }
}

export class MemberNotFoundError extends NotFoundError {
  readonly code = memberErrorCodes.MEMBER_NOT_FOUND;

  constructor() {
    super('Member not found');
  }
}
