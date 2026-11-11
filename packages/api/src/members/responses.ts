import { memberErrorCodes, userErrorCodes } from '@forumate/errors';

import { ApiResponse } from '../types';

import { MemberDto } from './dtos';

// Create Member Response
export type CreateMemberDomainError =
  | typeof memberErrorCodes.MEMBER_NOT_FOUND
  | typeof userErrorCodes.USERNAME_ALREADY_TAKEN;

export type CreateMemberApiResponse = ApiResponse<
  MemberDto,
  CreateMemberDomainError
>;

// Get Member Details Response
export type GetMemberDetailsError = typeof memberErrorCodes.MEMBER_NOT_FOUND;

export type GetMemberDetailsApiResponse = ApiResponse<
  MemberDto,
  GetMemberDetailsError
>;
