import { AnyApplicationError } from '@forumate/errors/application';
import { ConflictError, ValidationError } from '@forumate/errors/application';
import { AnyServerError } from '@forumate/errors/server';

import { ApiResponse } from '../types';

import { UserDto } from './dtos';

// Errors
export type CreateUserErrors =
  | ConflictError // username, email
  | ValidationError
  | AnyServerError;

// Api Responses
export type CreateUserApiResponse = ApiResponse<
  UserDto,
  CreateUserErrors['code']
>;

export type UserNotFoundError = 'UserNotFound';
export type GetUserByEmailErrors = UserNotFoundError;

export type GetUserByEmailApiResponse = ApiResponse<
  UserDto,
  GetUserByEmailErrors
>;
export type GetUserErrors = GetUserByEmailErrors;

export type UserResponse = ApiResponse<
  CreateUserApiResponse | GetUserByEmailApiResponse | null,
  GetUserErrors | AnyServerError['code'] | AnyApplicationError['code']
>;
