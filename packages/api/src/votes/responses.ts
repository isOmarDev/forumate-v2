import {
  commentErrorCodes,
  memberErrorCodes,
  postErrorCodes,
  RequestErrorCode,
  ServerErrorCode,
  applicationErrorCodes,
} from '@forumate/errors';

import { ApiResponse } from '../types';

import { PostVoteDto } from './dtos';

// Errors
type CommentNotFoundError = typeof commentErrorCodes.COMMENT_NOT_FOUND;
type PostNotFoundError = typeof postErrorCodes.POST_NOT_FOUND;
type MemberNotFoundError = typeof memberErrorCodes.MEMBER_NOT_FOUND;
type ForbiddenError = typeof applicationErrorCodes.FORBIDDEN;

type RequestError = RequestErrorCode;
type ServerError = ServerErrorCode;
type NetworkError = 'NETWORK_ERROR';

// Vote on Post Response
export type VoteOnPostError =
  | PostNotFoundError
  | MemberNotFoundError
  | ForbiddenError
  | RequestError
  | ServerError
  | NetworkError;

export type VoteOnPostApiResponse = ApiResponse<PostVoteDto, VoteOnPostError>;
