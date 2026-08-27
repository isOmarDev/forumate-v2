import { ValidationError } from '../application';

import { requestErrorCodes } from './codes';

export type RequestError =
  | MissingRequestBodyError
  | InvalidRequestBodyError
  | MissingRequestQueryParamsError
  | InvalidRequestQueryParamsError
  | InvalidInputError;

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

export class InvalidInputError extends ValidationError {
  readonly code = requestErrorCodes.INVALID_INPUT;

  constructor(fields: string[]) {
    super('Invalid input: ' + fields.join(', '));
  }
}
