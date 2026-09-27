import { memberErrorCodes, postErrorCodes } from '@forumate/errors';

import { ApiResponse } from '../types';

import { PostDto } from './dtos';

// Create Post Response
type CreatePostDomainError =
  | typeof memberErrorCodes.MEMBER_NOT_FOUND
  | typeof memberErrorCodes.INSUFFICIENT_MEMBER_LEVEL
  | typeof postErrorCodes.INVALID_POST_TITLE
  | typeof postErrorCodes.INVALID_POST_CONTENT
  | typeof postErrorCodes.INVALID_POST_LINK;

export type CreatePostApiResponse = ApiResponse<PostDto, CreatePostDomainError>;

// Get Posts Response
export type GetPostsError = never;

export type GetPostsApiResponse = ApiResponse<PostDto[], GetPostsError>;

// Get Post by ID Response
export type GetPostByIdError = never;

export type GetPostByIdApiResponse = ApiResponse<PostDto, GetPostByIdError>;

// Get Post Details Response
export type GetPostDetailsError = never;

export type GetPostDetailsApiResponse = ApiResponse<
  PostDto,
  GetPostDetailsError
>;
