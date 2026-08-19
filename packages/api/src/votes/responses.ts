import { AnyApplicationError } from '@forumate/errors/application';
import { AnyServerError } from '@forumate/errors/server';

import { ApiResponse } from '..';

import { PostVoteDTO } from './dtos';

// Api Responses
export type VoteOnPostApiResponse = ApiResponse<
  PostVoteDTO,
  VoteErrors['code']
>;

export type AnyVotesApiResponse = VoteOnPostApiResponse;

export type VoteErrors = AnyServerError | AnyApplicationError;