import { ApiResponse } from '..';
import { AnyServerError } from '@forumate/errors/server';
import { AnyApplicationError } from '@forumate/errors/application';

import { PostVoteDTO } from './dtos';

// Api Responses
export type VoteOnPostApiResponse = ApiResponse<
  PostVoteDTO,
  VoteErrors['code']
>;

export type AnyVotesApiResponse = VoteOnPostApiResponse;

export type VoteErrors = AnyServerError | AnyApplicationError;