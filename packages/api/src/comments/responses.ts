import { ApiResponse } from '../types';

import { CommentDto } from './dtos';

export type GetCommentsByPostIdApiResponse = ApiResponse<
  CommentDto[],
  'COMMENTS_NOT_FOUND'
>;

export type PostCommentApiResponse = ApiResponse<
  CommentDto,
  'POST_NOT_FOUND' | 'INVALID_COMMENT'
>;
