import {
  memberErrorCodes,
  userErrorCodes,
  RequestErrorCode,
} from '@forumate/errors';
import { ServerErrorCode } from '@forumate/errors/server';

import { ApiResponse } from '../types';

import { MemberDto } from './dtos';

// Errors
type MemberNotFoundError = typeof memberErrorCodes.MEMBER_NOT_FOUND;
type UsernameAlreadyTakenError = typeof userErrorCodes.USERNAME_ALREADY_TAKEN;

type RequestError = RequestErrorCode;
type ServerError = ServerErrorCode;
type NetworkError = 'NETWORK_ERROR';

// Create Member Response
export type CreateMemberError =
  UsernameAlreadyTakenError | ServerError | RequestError | NetworkError;

export type CreateMemberApiResponse = ApiResponse<MemberDto, CreateMemberError>;

// Get Member Details Response
export type GetMemberDetailsError =
  MemberNotFoundError | ServerError | 'NETWORK_ERROR';

export type GetMemberDetailsApiResponse = ApiResponse<
  MemberDto,
  GetMemberDetailsError
>;
