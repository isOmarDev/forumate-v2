import { type ErrorCode } from './error-codes';

export const errorCategories = {
  VALIDATION: 'VALIDATION',
  UNAUTHORIZED: 'UNAUTHORIZED',
  PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  INTERNAL: 'INTERNAL',
} as const;

export type ErrorCategory =
  (typeof errorCategories)[keyof typeof errorCategories];

export abstract class CustomError extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly category: ErrorCategory;

  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
