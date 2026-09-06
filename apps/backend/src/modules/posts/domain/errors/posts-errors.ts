import z from 'zod';

import { type CreatePostInput } from '@forumate/api/posts';
import { ValidationError, NotFoundError } from '@forumate/errors/application';
import { postErrorCodes } from '@forumate/errors/domain';

export type PostCreationError =
  | InvalidPostTitleError
  | InvalidPostContentError
  | InvalidPostLinkError
  | InvalidPostTypeError;

export function mapPostValidationError(
  error: z.ZodError,
  input: CreatePostInput,
): PostCreationError {
  const issue = error.issues[0];

  switch (issue?.path[0]) {
    case 'title':
      return new InvalidPostTitleError(issue.message);

    case 'content':
      return new InvalidPostContentError(issue.message);

    case 'link':
      return new InvalidPostLinkError(issue.message);

    case 'postType':
      return new InvalidPostTypeError(input.postType);

    default:
      return new InvalidPostTypeError(input.postType);
  }
}

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

  constructor(type: string) {
    super(`Invalid Post type: ${type}`);
  }
}

export class PostNotFoundError extends NotFoundError {
  readonly code = postErrorCodes.POST_NOT_FOUND;

  constructor() {
    super('Post not foud');
  }
}
