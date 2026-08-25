import { AnyApplicationError } from '@forumate/errors/application';
import { AnyServerError } from '@forumate/errors/server';

import { ApiResponse } from '../types';

import { PostVoteDto } from './dtos';

// Api Responses
export type VoteOnPostApiResponse = ApiResponse<
  PostVoteDto,
  VoteErrors['code']
>;

export type AnyVotesApiResponse = VoteOnPostApiResponse;

export type VoteErrors = AnyServerError | AnyApplicationError;
