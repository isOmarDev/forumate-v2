import { apiRequest } from '../api-request';
import { getAuthHeaders, type HttpClient } from '../client';

import type { PostCommentInput } from './inputs';
import type {
  GetCommentsByPostIdApiResponse,
  PostCommentApiResponse,
} from './responses';

export const createCommentsApi = (client: HttpClient) => {
  return {
    postComment: (input: PostCommentInput, authToken: string) =>
      apiRequest(() =>
        client.post<PostCommentApiResponse>(
          `/posts/${input.postId}/comments`,
          input,
          getAuthHeaders(authToken),
        ),
      ),

    getCommentsByPostId: (postId: string) =>
      apiRequest(() =>
        client.get<GetCommentsByPostIdApiResponse>(`/posts/${postId}/comments`),
      ),
  };
};
