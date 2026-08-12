import { ApiResponse } from '..';
import { AnyServerError } from '@forumate/errors/server';
import { AnyApplicationError } from '@forumate/errors/application';

import { PostDTO } from './dtos';

// Errors
export type GetPostDetailsError = '';
export type GetPostsErrors = '';
export type CreatePostErrors = '';
export type GetPostByIdErrors = '';
export type AnyPostError = AnyServerError | AnyApplicationError;

// API Responses
export type GetPostsApiResponse = ApiResponse<PostDTO[], GetPostsErrors>;
export type CreatePostApiResponse = ApiResponse<PostDTO, CreatePostErrors>;
export type GetPostByIdApiResponse = ApiResponse<PostDTO, GetPostByIdErrors>;
export type GetPostDetailsResponse = ApiResponse<PostDTO, GetPostDetailsError>;
export type AnyPostsApiResponse =
  GetPostsApiResponse | CreatePostApiResponse | AnyPostError; // TODO: this pattern throughout
// TODO: tidy functional errors; see users.ts