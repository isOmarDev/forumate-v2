import axios from 'axios';

import { getAuthHeaders } from '..';

import { PostCommentInput } from './inputs';
import { GetCommentsByPostIdApiResponse,PostCommentApiResponse } from './responses';

export const createCommentsApi = (apiURL: string) => {
  return {
    postComment: async (
      input: PostCommentInput,
      authToken: string,
    ): Promise<PostCommentApiResponse> => {
      try {
        const successResponse = await axios.post(
          `${apiURL}/posts/${input.postId}/comments`,
          input,
          getAuthHeaders(authToken),
        );
        return successResponse.data as PostCommentApiResponse;
      } catch (_err: unknown) {
        if (axios.isAxiosError(_err) && _err.response) {
          return _err.response.data as PostCommentApiResponse;
        }
        return {
          data: null,
          error: {
            message: 'Unknown error',
            code: 'INVALID_COMMENT',
          },
          success: false,
        };
      }
    },
    getCommentsByPostId: async (
      postId: string,
    ): Promise<GetCommentsByPostIdApiResponse> => {
      try {
        const successResponse = await axios.get(
          `${apiURL}/posts/${postId}/comments`,
        );
        return successResponse.data as GetCommentsByPostIdApiResponse;
      } catch (_err: unknown) {
        if (axios.isAxiosError(_err) && _err.response) {
          return _err.response.data as GetCommentsByPostIdApiResponse;
        }
        return {
          data: null,
          error: {
            message: 'Unknown error',
            code: 'COMMENTS_NOT_FOUND',
          },
          success: false,
        };
      }
    },
  };
};