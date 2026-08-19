import { NextFunction,Request, Response } from 'express';

import { MarketingResponse } from '@forumate/api/marketing';
import { ValidationError } from '@forumate/errors/application';
import { CustomError } from '@forumate/errors/custom';
import { GenericServerError } from '@forumate/errors/server';

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
