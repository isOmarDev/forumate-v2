export const networkErrorCodes = {
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  REQUEST_ERROR: 'REQUEST_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type NetworkErrorCode =
  (typeof networkErrorCodes)[keyof typeof networkErrorCodes];
