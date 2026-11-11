import { ValidationError, NotFoundError } from '@forumate/errors/application';
import { postErrorCodes } from '@forumate/errors/domain';

export class InvalidPostTitleError extends ValidationError {
  readonly code = postErrorCodes.INVALID_POST_TITLE;

  constructor(message: string) {
    super(`Invalid post title: ${message}`);
  }
}

export class InvalidPostContentError extends ValidationError {
  readonly code = postErrorCodes.INVALID_POST_CONTENT;

  constructor(message: string) {
    super(`Invalid post content: ${message}`);
  }
}

export class InvalidPostLinkError extends ValidationError {
  readonly code = postErrorCodes.INVALID_POST_LINK;

  constructor(message: string) {
    super(`Invalid post link: ${message}`);
  }
}

export class InvalidPostTypeError extends ValidationError {
  readonly code = postErrorCodes.INVALID_POST_TYPE;

  constructor(message: string = 'Invalid Post type') {
    super(message);
  }
}

export class InvalidTextPostError extends ValidationError {
  readonly code = postErrorCodes.INVALID_TEXT_POST;

  constructor(message = 'Text post is invalid') {
    super(message);
  }
}

export class InvalidLinkPostError extends ValidationError {
  readonly code = postErrorCodes.INVALID_LINK_POST;

  constructor(message = 'Link post is invalid') {
    super(message);
  }
}

export class PostNotFoundError extends NotFoundError {
  readonly code = postErrorCodes.POST_NOT_FOUND;

  constructor() {
    super('Post not found');
  }
}
