import { apiRequest } from '../api-request';
import { getAuthHeaders, type HttpClient } from '../client';

import type { PostCommentInput } from './inputs';
import type {
  GetCommentsByPostIdApiResponse,
  PostCommentApiResponse,
} from './responses';

export const createCommentsApi = (client: HttpClient) => {
  return {
    postComment: ({ postId, ...input }: PostCommentInput, authToken: string) =>
      apiRequest(() =>
        client.post<PostCommentApiResponse>(
          `/posts/${postId}/comments`,
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
