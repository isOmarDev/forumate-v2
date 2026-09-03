import { apiRequest } from '../api-request';
import { getAuthHeaders, type HttpClient } from '../client';

import type { CreateCommentInput } from './inputs';
import type {
  GetCommentsByPostIdApiResponse,
  PostCommentApiResponse,
} from './responses';

export const createCommentsApi = (client: HttpClient) => {
  return {
    postComment: (input: CreateCommentInput, authToken: string) =>
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
