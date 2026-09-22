import { NotFoundError } from '@forumate/errors/application';
import { memberErrorCodes } from '@forumate/errors/domain';

export class MemberNotFoundError extends NotFoundError {
  readonly code = memberErrorCodes.MEMBER_NOT_FOUND;

  constructor() {
    super('Member not found');
  }
}
