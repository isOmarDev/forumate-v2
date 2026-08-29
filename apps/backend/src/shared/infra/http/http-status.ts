import { ErrorCategory } from '@forumate/errors/custom';

export const httpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = (typeof httpStatus)[keyof typeof httpStatus];

export const CATEGORY_TO_STATUS: Record<ErrorCategory, HttpStatus> = {
  VALIDATION: httpStatus.BAD_REQUEST,
  UNAUTHORIZED: httpStatus.UNAUTHORIZED,
  PAYMENT_REQUIRED: httpStatus.PAYMENT_REQUIRED,
  FORBIDDEN: httpStatus.FORBIDDEN,
  NOT_FOUND: httpStatus.NOT_FOUND,
  CONFLICT: httpStatus.CONFLICT,
  TOO_MANY_REQUESTS: httpStatus.TOO_MANY_REQUESTS,
  INTERNAL: httpStatus.INTERNAL_SERVER_ERROR,
};
