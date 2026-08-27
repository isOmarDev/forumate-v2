import { CustomError, errorCategories } from '../custom';
import { type ErrorCode } from '../error-codes';

export type ApplicationError =
  | ValidationError
  | NotFoundError
  | ConflictError
  | UnauthorizedError
  | ForbiddenError;

export abstract class ValidationError extends CustomError {
  readonly category = errorCategories.VALIDATION;
  abstract readonly code: ErrorCode;

  constructor(
    message: string,
    readonly fieldErrors?: Array<{
      field: string;
      message: string;
    }>,
  ) {
    super(message);
  }
}

export abstract class NotFoundError extends CustomError {
  readonly category = errorCategories.NOT_FOUND;
  abstract readonly code: ErrorCode;

  constructor(public message: string) {
    super(message);
  }
}

export abstract class ConflictError extends CustomError {
  readonly category = errorCategories.CONFLICT;
  abstract readonly code: ErrorCode;

  constructor(message: string) {
    super(message);
  }
}

export abstract class UnauthorizedError extends CustomError {
  readonly category = errorCategories.UNAUTHORIZED;
  abstract readonly code: ErrorCode;

  constructor(message: string) {
    super(message);
  }
}

export abstract class ForbiddenError extends CustomError {
  readonly category = errorCategories.FORBIDDEN;
  abstract readonly code: ErrorCode;

  constructor(message: string) {
    super(message);
  }
}
