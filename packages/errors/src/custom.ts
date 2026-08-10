type ErrorType =
  // Application
  | 'ValidationError'
  | 'PermissionError'
  | 'NotFoundError'
  | 'ConflictError'
  | 'CustomError'
  | 'UnauthorizedError'
  // Server
  | 'InvalidRequestBodyError'
  | 'InvalidParamsError'
  | 'MissingRequestParamsError'
  | 'InvalidRequestParamsError'
  | 'DatabaseError'
  | 'GenericServerError';

export class CustomError extends Error {
  constructor(
    message: string,
    public type: ErrorType = 'CustomError',
  ) {
    super(message);
    this.type = type;
  }
}
