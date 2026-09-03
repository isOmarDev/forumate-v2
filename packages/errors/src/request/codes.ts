const RequestBodyErrorCode = {
  MISSING_REQUEST_BODY: 'MISSING_REQUEST_BODY',
  INVALID_REQUEST_BODY: 'INVALID_REQUEST_BODY',
  INVALID_REQUEST_INPUT: 'INVALID_REQUEST_INPUT',
} as const;

const RequestQueryErrorCode = {
  MISSING_REQUEST_QUERY_PARAMS: 'MISSING_REQUEST_QUERY_PARAMS',
  INVALID_REQUEST_QUERY_PARAMS: 'INVALID_REQUEST_QUERY_PARAMS',
} as const;

const RequestPathParamsErrorCode = {
  INVALID_REQUEST_PATH_PARAMS: 'INVALID_REQUEST_PATH_PARAMS',
} as const;

export const requestErrorCodes = {
  ...RequestBodyErrorCode,
  ...RequestQueryErrorCode,
  ...RequestPathParamsErrorCode,
} as const;

export type RequestErrorCode =
  (typeof requestErrorCodes)[keyof typeof requestErrorCodes];
