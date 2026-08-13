import { AnyApplicationError } from '@forumate/errors/application';
import { ConflictError, ValidationError } from '@forumate/errors/application';
import { AnyServerError } from '@forumate/errors/server';

import { ApiResponse } from '..';

import { UserDTO } from './dtos';

// Errors
export type CreateUserErrors =
  | ConflictError // username, email
  | ValidationError
  | AnyServerError;

// Api Responses
export type CreateUserResponse = ApiResponse<UserDTO, CreateUserErrors['code']>;

export type UserNotFoundError = 'UserNotFound';
export type GetUserByEmailErrors = UserNotFoundError;

export type GetUserByEmailResponse = ApiResponse<UserDTO, GetUserByEmailErrors>;
export type GetUserErrors = GetUserByEmailErrors;

export type UserResponse = ApiResponse<
  CreateUserResponse | GetUserByEmailResponse | null,
  GetUserErrors | AnyServerError['code'] | AnyApplicationError['code']
>;
