export const serverErrorCodes = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export type ServerErrorCode =
  (typeof serverErrorCodes)[keyof typeof serverErrorCodes];
