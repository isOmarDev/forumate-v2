import {
  commentErrorCodes,
  postErrorCodes,
  memberErrorCodes,
} from '@forumate/errors';

import { ApiResponse } from '../types';

import { CommentDto } from './dtos';

// Get Comments By Post Id Response
export type GetCommentsByPostIdApiResponse = ApiResponse<CommentDto[], never>;

// Post Comment Response
export type PostCommentError =
  | typeof memberErrorCodes.MEMBER_NOT_FOUND
  | typeof memberErrorCodes.INSUFFICIENT_MEMBER_LEVEL
  | typeof commentErrorCodes.INVALID_COMMENT_BODY
  | typeof postErrorCodes.POST_NOT_FOUND;

export type PostCommentApiResponse = ApiResponse<CommentDto, PostCommentError>;
