import { FieldErrors, ValidationError } from '../application';

import { requestErrorCodes } from './codes';

type RequestBodyError =
  MissingRequestBodyError | InvalidRequestBodyError | InvalidRequestInputError;

type RequestQueryError =
  MissingRequestQueryParamsError | InvalidRequestQueryParamsError;

type RequestPathParamsError = InvalidRequestPathParamsError;

export type RequestError =
  RequestBodyError | RequestQueryError | RequestPathParamsError;

// Request body

export class MissingRequestBodyError extends ValidationError {
  readonly code = requestErrorCodes.MISSING_REQUEST_BODY;

  constructor() {
    super('Request body is missing');
  }
}

export class InvalidRequestBodyError extends ValidationError {
  readonly code = requestErrorCodes.INVALID_REQUEST_BODY;

  constructor(missingKeys: string[]) {
    super('Body is missing required key: ' + missingKeys.join(', '));
  }
}

export class InvalidRequestInputError extends ValidationError {
  readonly code = requestErrorCodes.INVALID_REQUEST_INPUT;

  constructor(fieldErrors: FieldErrors) {
    super('One or more fields are invalid', fieldErrors);
  }
}

// Request query

export class MissingRequestQueryParamsError extends ValidationError {
  readonly code = requestErrorCodes.MISSING_REQUEST_QUERY_PARAMS;

  constructor(missingparams: string[]) {
    super('Query is missing required params: ' + missingparams.join(', '));
  }
}

export class InvalidRequestQueryParamsError extends ValidationError {
  readonly code = requestErrorCodes.INVALID_REQUEST_QUERY_PARAMS;

  constructor(invalidParams: string[]) {
    super('Query has invalid params: ' + invalidParams.join(', '));
  }
}

// Request Path params

export class InvalidRequestPathParamsError extends ValidationError {
  readonly code = requestErrorCodes.INVALID_REQUEST_PATH_PARAMS;

  constructor(invalidParams: string[]) {
    super(`Path has invalid params: ${invalidParams.join(', ')}`);
  }
}
