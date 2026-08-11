import {
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
  UserNotFoundException,
} from './usersExceptions';
import { Request, Response, NextFunction } from 'express';
import { UserResponse } from '@forumate/api/users';
import {
  ApplicationEntity,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@forumate/errors/application';
import { GenericServerError } from '@forumate/errors/server';
import { CustomError } from '@forumate/errors/custom';

interface ErrorWithEntity extends CustomError {
  missingEntityType?: ApplicationEntity;
}

export function userErrorHandler(
  error: ErrorWithEntity,
  _: Request,
  res: Response,
  _next: NextFunction,
): Response<UserResponse> {
  let responseBody: UserResponse;

  // Handle validation errors
  if (
    error.type === 'InvalidRequestBodyError' ||
    error.type === 'InvalidParamsError'
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        message: error.message,
        code: new ValidationError(error.message),
      },
    });
  }

  // Handle not found errors
  if (error instanceof NotFoundError) {
    responseBody = {
      success: false,
      data: null,
      error: {
        message: 'not found',
        code: new NotFoundError(error.missingEntityType || 'user'),
      },
    };
    return res.status(404).json(responseBody);
  }

  // Handle conflict errors
  if (error instanceof EmailAlreadyInUseException) {
    responseBody = {
      success: false,
      data: null,
      error: {
        message: 'Email Already In Use Exception',
        code: new ConflictError('user', error.message),
      },
    };
    return res.status(409).json(responseBody);
  }

  if (error instanceof UserNotFoundException) {
    responseBody = {
      success: false,
      data: null,
      error: {
        message: 'User Not Found',
        code: new NotFoundError('user', error.message),
      },
    };
    return res.status(404).json(responseBody);
  }

  // Handle all other errors as server errors
  responseBody = {
    success: false,
    data: null,
    error: {
      message: 'server error',
      code: new GenericServerError(error.message),
    },
  };

  return res.status(500).json(responseBody);
}
