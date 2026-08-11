import { Request, Response, NextFunction } from 'express';

import { GenericServerError } from '@forumate/errors/server';
import { ValidationError } from '@forumate/errors/application';
import { MarketingResponse } from '@forumate/api/marketing';
import { CustomError } from '@forumate/errors/custom';

export function marketingErrorHandler(
  error: CustomError,
  _: Request,
  res: Response,
  _next: NextFunction,
): Response<MarketingResponse> {
  if (error.name === 'InvalidRequestBodyError') {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        message: error.message,
        code: new ValidationError(error.message),
      },
    });
  }

  return res.status(500).json({
    success: false,
    data: null,
    error: {
      code: new GenericServerError(),
    },
  });
}
