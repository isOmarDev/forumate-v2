import {
  commentErrorCodes,
  postErrorCodes,
  RequestErrorCode,
  ServerErrorCode,
} from '@forumate/errors';

import { ApiResponse } from '../types';

import { CommentDto } from './dtos';

// Comment Errors
type CommentsNotFoundError = typeof commentErrorCodes.COMMENTS_NOT_FOUND;
type InvalidCommentError = typeof commentErrorCodes.INVALID_COMMENT;
type PostNotFoundError = typeof postErrorCodes.POST_NOT_FOUND;

type RequestError = RequestErrorCode;
type ServerError = ServerErrorCode;

// Get Comments By Post ID Response
export type GetCommentsByPostIdError =
  CommentsNotFoundError | RequestError | ServerError;

export type GetCommentsByPostIdApiResponse = ApiResponse<
  CommentDto[],
  GetCommentsByPostIdError
>;

// Post Comment Response
export type PostCommentError =
  InvalidCommentError | PostNotFoundError | RequestError | ServerError;

export type PostCommentApiResponse = ApiResponse<CommentDto, PostCommentError>;
