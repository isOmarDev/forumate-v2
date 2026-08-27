export const userErrorCodes = {
  USERNAME_ALREADY_TAKEN: 'USERNAME_ALREADY_TAKEN',
  EMAIL_ALREADY_TAKEN: 'EMAIL_ALREADY_TAKEN',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_USER_ID: 'INVALID_USER_ID',
  MISSING_USER_ID: 'MISSING_USER_ID',
} as const;

export type UserErrorCode =
  (typeof userErrorCodes)[keyof typeof userErrorCodes];
