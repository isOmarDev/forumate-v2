import { ApiError } from '@forumate/api';
import { CustomError, ErrorCode, ValidationError } from '@forumate/errors';

export const toApiError = (error: CustomError): ApiError<ErrorCode> => {
  if (error instanceof ValidationError) {
    return {
      code: error.code,
      message: error.message,
      fields: error.fieldErrors ?? [],
    } as ApiError<ErrorCode>;
  }

  return {
    code: error.code,
    message: error.message,
  } as ApiError<ErrorCode>;
};
