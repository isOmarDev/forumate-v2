export const memberErrorCodes = {
  MEMBER_NOT_FOUND: 'MEMBER_NOT_FOUND',
  INVALID_MEMBER_USERNAME: 'INVALID_MEMBER_USERNAME',
} as const;

export type MemberErrorCode =
  (typeof memberErrorCodes)[keyof typeof memberErrorCodes];
