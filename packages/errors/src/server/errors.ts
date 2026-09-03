import { CustomError, errorCategories } from '../custom';

import { serverErrorCodes } from './codes';

export type ServerError = InternalServerError | DatabaseError;

export class InternalServerError extends CustomError {
  readonly code = serverErrorCodes.INTERNAL_SERVER_ERROR;
  readonly category = errorCategories.INTERNAL;

  constructor(message?: string) {
    super(message || 'Something went wrong on our end');
  }
}

export class DatabaseError extends CustomError {
  readonly code = serverErrorCodes.DATABASE_ERROR;
  readonly category = errorCategories.INTERNAL;

  constructor(message?: string) {
    super(message || 'A database error occurred');
  }
}
