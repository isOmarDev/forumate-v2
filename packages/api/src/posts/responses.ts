import { AnyApplicationError } from '@forumate/errors/application';
import { AnyServerError } from '@forumate/errors/server';

import { ApiResponse } from '../types';

import { PostDto } from './dtos';

// Errors
export type GetPostDetailsError = '';
export type GetPostsErrors = '';
export type CreatePostErrors = '';
export type GetPostByIdErrors = '';
export type AnyPostError = AnyServerError | AnyApplicationError;

// API Responses
export type GetPostsApiResponse = ApiResponse<PostDto[], GetPostsErrors>;
export type CreatePostApiResponse = ApiResponse<PostDto, CreatePostErrors>;
export type GetPostByIdApiResponse = ApiResponse<PostDto, GetPostByIdErrors>;
export type GetPostDetailsResponse = ApiResponse<PostDto, GetPostDetailsError>;
export type AnyPostsApiResponse =
  GetPostsApiResponse | CreatePostApiResponse | AnyPostError; // TODO: this pattern throughout
// TODO: tidy functional errors; see users.ts
