import {
  memberErrorCodes,
  postErrorCodes,
  RequestErrorCode,
  ServerErrorCode,
} from '@forumate/errors';

import { ApiResponse } from '../types';

import { PostDto } from './dtos';

// Error types
type MemberNotFoundError = typeof memberErrorCodes.MEMBER_NOT_FOUND;
type PostCreationForbiddenError = typeof postErrorCodes.POST_CREATION_FORBIDDEN;

type RequestError = RequestErrorCode;
type ServerError = ServerErrorCode;
type NetworkError = 'NETWORK_ERROR';

// Get Posts Response
export type GetPostsErrors = ServerError | NetworkError | RequestError;

export type GetPostsApiResponse = ApiResponse<PostDto[], GetPostsErrors>;

// Create Post Response
export type CreatePostError =
  | MemberNotFoundError
  | PostCreationForbiddenError
  | ServerError
  | NetworkError
  | RequestError;

export type CreatePostApiResponse = ApiResponse<PostDto, CreatePostError>;

// Get Post by ID Response
export type GetPostByIdError = ServerError | NetworkError | RequestError;
export type GetPostByIdApiResponse = ApiResponse<PostDto, GetPostByIdError>;

// Get Post Details Response
export type GetPostDetailsError = ServerError | NetworkError | RequestError;

export type GetPostDetailsApiResponse = ApiResponse<
  PostDto,
  GetPostDetailsError
>;
