import { ValidationError } from '@forumate/errors/application';
import { commentErrorCodes } from '@forumate/errors/domain';

export class InvalidCommentBodyError extends ValidationError {
  readonly code = commentErrorCodes.INVALID_COMMENT_BODY;

  constructor(message: string) {
    super(message);
  }
}
