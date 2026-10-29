import { NotFoundError, ValidationError } from '@forumate/errors/application';
import { commentErrorCodes } from '@forumate/errors/domain';

export class InvalidCommentBodyError extends ValidationError {
  readonly code = commentErrorCodes.INVALID_COMMENT_BODY;

  constructor(message: string) {
    super(message);
  }
}

export class CommentNotFoundError extends NotFoundError {
  readonly code = commentErrorCodes.COMMENT_NOT_FOUND;

  constructor() {
    super('Comment not found');
  }
}
