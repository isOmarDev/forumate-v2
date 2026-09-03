import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { FailureApiResponse } from '@forumate/api';
import { CustomError, ErrorCode } from '@forumate/errors';
import { InternalServerError } from '@forumate/errors/server';

import { httpStatus, CATEGORY_TO_STATUS } from '../infra/http/http-status';
import { toApiError } from '../infra/http/to-api-error';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _: Request,
  res: Response<FailureApiResponse<ErrorCode>>,
  _next: NextFunction,
) => {
  if (err instanceof CustomError) {
    const status = CATEGORY_TO_STATUS[err.category];

    return res.status(status).json({
      success: false,
      status,
      data: null,
      error: toApiError(err),
    });
  }

  console.error('--- UNEXPECTED ERROR ---');
  console.error(err);

  const { code, message } = new InternalServerError();
  const status = httpStatus.INTERNAL_SERVER_ERROR;

  return res.status(status).json({
    success: false,
    status,
    data: null,
    error: {
      code,
      message,
    },
  });
};
