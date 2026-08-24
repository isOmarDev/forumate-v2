import { apiRequest } from '../api-request';
import { getAuthHeaders } from '../client';
import { HttpClient } from '../client';

import { PostCommentInput } from './inputs';
import {
  GetCommentsByPostIdApiResponse,
  PostCommentApiResponse,
} from './responses';

export const createCommentsApi = (client: HttpClient) => {
  return {
    postComment: (
      input: PostCommentInput,
      authToken: string,
    ): Promise<PostCommentApiResponse> =>
      apiRequest(() =>
        client.post<PostCommentApiResponse>(
          `/posts/${input.postId}/comments`,
          input,
          getAuthHeaders(authToken),
        ),
      ),

    getCommentsByPostId: (
      postId: string,
    ): Promise<GetCommentsByPostIdApiResponse> =>
      apiRequest(() =>
        client.get<GetCommentsByPostIdApiResponse>(`/posts/${postId}/comments`),
      ),
  };
};
