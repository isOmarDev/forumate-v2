import { Request, Response, NextFunction } from 'express';

import { AnyVotesApiResponse } from '@forumate/api/votes';
import { AnyApplicationError } from '@forumate/errors/application';

export function votesErrorHandler(
  error: Error,
  _: Request,
  res: Response,
  _next: NextFunction,
): Response<AnyVotesApiResponse> {
  // Updated return type

  switch ((error as AnyApplicationError).name) {
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
    case 'ServerError':
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
