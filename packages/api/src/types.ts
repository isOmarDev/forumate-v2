export type ApiError<U extends string> = {
  message: string;
  code: U;
};

export type SuccessApiResponse<D> = {
  success: true;
  data: D;
  statusCode: number | null;
  error: null;
};

export type FailureApiResponse<E extends string> = {
  success: false;
  data: null;
  statusCode: number | null;
  error: ApiError<E>;
};

export type ApiResponse<D, E extends string> =
  SuccessApiResponse<D> | FailureApiResponse<E>;

export type EndpointResponse<T, U extends string> = ApiResponse<
  T,
  U | TransportErrors | GenericErrors
>;

export type ValidationError = 'VALIDATION_ERROR';
export type ServerError = 'SERVER_ERROR';
export type ClientError = 'CLIENT_ERROR';

export type GenericErrors = ValidationError | ServerError | ClientError;

export type TimeoutError = 'TIMEOUT_ERROR';
export type NetworkError = 'NETWORK_ERROR';
export type RequestError = 'REQUEST_ERROR';
export type UnknownError = 'UNKNOWN_ERROR';

export type TransportErrors =
  TimeoutError | NetworkError | RequestError | UnknownError;
