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
export type CreateUserResponse = ApiResponse<UserDto, CreateUserErrors['code']>;

export type UserNotFoundError = 'UserNotFound';
export type GetUserByEmailErrors = UserNotFoundError;

export type GetUserByEmailResponse = ApiResponse<UserDto, GetUserByEmailErrors>;
export type GetUserErrors = GetUserByEmailErrors;

export type UserResponse = ApiResponse<
  CreateUserResponse | GetUserByEmailResponse | null,
  GetUserErrors | AnyServerError['code'] | AnyApplicationError['code']
>;
