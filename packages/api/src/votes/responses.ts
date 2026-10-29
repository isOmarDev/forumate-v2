import {
  commentErrorCodes,
  memberErrorCodes,
  postErrorCodes,
} from '@forumate/errors/domain';

import { ApiResponse } from '../types';

import { VoteOnCommentDto, VoteOnPostDto } from './dtos';

// Vote on Post Response
export type VoteOnPostError =
  | typeof postErrorCodes.POST_NOT_FOUND
  | typeof memberErrorCodes.MEMBER_NOT_FOUND;

export type VoteOnPostApiResponse = ApiResponse<VoteOnPostDto, VoteOnPostError>;

// Vote on Comment Response
export type VoteOnCommentError =
  | typeof commentErrorCodes.COMMENT_NOT_FOUND
  | typeof memberErrorCodes.MEMBER_NOT_FOUND;

export type VoteOnCommentApiResponse = ApiResponse<
  VoteOnCommentDto,
  VoteOnCommentError
>;
