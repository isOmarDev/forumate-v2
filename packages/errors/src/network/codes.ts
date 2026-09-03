export const networkErrorCodes = {
  timeoutError: 'TIMEOUT_ERROR',
  networkError: 'NETWORK_ERROR',
  requestError: 'REQUEST_ERROR',
  unknownError: 'UNKNOWN_ERROR',
} as const;

export type NetworkErrorCode =
  (typeof networkErrorCodes)[keyof typeof networkErrorCodes];
