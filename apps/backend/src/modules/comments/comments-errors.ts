import { Request, Response, NextFunction } from 'express';
import { GetCommentsByPostIdApiResponse } from '@forumate/api';
import { AnyApplicationError } from '@forumate/errors/application';
import { CustomError } from '@forumate/errors/custom';

export function commentsErrorHandler(
  error: CustomError,
  _: Request,
  res: Response,
  _next: NextFunction,
): Response<GetCommentsByPostIdApiResponse> {
  const errorType = (error as AnyApplicationError).code;

  switch (errorType) {
    case 'PermissionError':
      return res.status(403).json({
        success: false,
        data: undefined,
        error: {
          code: error.name,
          message: error.message,
        },
      });
    case 'ValidationError':
      return res.status(400).json({
        success: false,
        data: undefined,
        error: {
          code: error.name,
          message: error.message,
        },
      });
    case 'GenericServerError':
    default:
      return res.status(500).json({
        success: false,
        data: undefined,
        error: {
          code: error.name,
          message: error.message,
        },
      });
  }
}
