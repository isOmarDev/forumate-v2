import { AnyApplicationError } from '@forumate/errors/application';
import { AnyServerError } from '@forumate/errors/server';

import { ApiResponse } from '../types';

import { MemberDto } from './dtos';

// Errors
export type UsernameAlreadyTakenError = 'UsernameAlreadyTaken';

export type CreateMemberError = UsernameAlreadyTakenError;

export type AnyMemberError =
  CreateMemberError | AnyApplicationError['code'] | AnyServerError['code'];

export type CreateMemberApiResponse = ApiResponse<
  MemberDto,
  CreateMemberError | 'NetworkError'
>;

// Api responses
export type GetMemberDetailsApiResponse = ApiResponse<
  MemberDto,
  AnyMemberError
>;

export type AnyMemberApiResponse = CreateMemberApiResponse;
