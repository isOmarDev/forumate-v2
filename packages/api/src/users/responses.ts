import {
  RequestErrorCode,
  userErrorCodes,
  ServerErrorCode,
} from '@forumate/errors';

import { ApiResponse } from '../types';

import { UserDto } from './dtos';

// User Error Types
type EmailAlreadyTakenError = typeof userErrorCodes.EMAIL_ALREADY_TAKEN;
type UsernameAlreadyTakenError = typeof userErrorCodes.USERNAME_ALREADY_TAKEN;
type UserNotFoundError = typeof userErrorCodes.USER_NOT_FOUND;

type RequestError = RequestErrorCode;
type ServerError = ServerErrorCode;
type NetworkError = 'NETWORK_ERROR';

// Create User Response
export type CreateUserError =
  | EmailAlreadyTakenError
  | UsernameAlreadyTakenError
  | ServerError
  | NetworkError;

export type CreateUserApiResponse = ApiResponse<UserDto, CreateUserError>;

// Get User By Email Response
export type GetUserByEmailError =
  UserNotFoundError | RequestError | ServerError | NetworkError;

export type GetUserByEmailApiResponse = ApiResponse<
  UserDto,
  GetUserByEmailError
>;
