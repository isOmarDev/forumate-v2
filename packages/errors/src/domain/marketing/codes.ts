export const marketingErrorCodes = {
  INVALID_EMAIL: 'INVALID_EMAIL',
  EMAIL_ALREADY_SUBSCRIBED: 'EMAIL_ALREADY_SUBSCRIBED',
} as const;

export type MarketingErrorCode =
  (typeof marketingErrorCodes)[keyof typeof marketingErrorCodes];
