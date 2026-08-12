import { ApiResponse } from '..';
import { CommentDTO } from './dtos';

export type GetCommentsByPostIdApiResponse = ApiResponse<
  CommentDTO[],
  'COMMENTS_NOT_FOUND'
>;

export type PostCommentApiResponse = ApiResponse<
  CommentDTO,
  'POST_NOT_FOUND' | 'INVALID_COMMENT'
>;