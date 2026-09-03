import { apiRequest } from '../api-request';
import { getAuthHeaders, type HttpClient } from '../client';

import type { CreatePostInput, GetPostsQueryInput } from './inputs';
import type {
  CreatePostApiResponse,
  GetPostByIdApiResponse,
  GetPostsApiResponse,
} from './responses';

export const createPostsApi = (client: HttpClient) => {
  return {
    create: (input: CreatePostInput, authToken: string) =>
      apiRequest(() =>
        client.post<CreatePostApiResponse>(
          '/posts',
          input,
          getAuthHeaders(authToken),
        ),
      ),

    getPosts: (query: GetPostsQueryInput) =>
      apiRequest(() =>
        client.get<GetPostsApiResponse>('/posts', {
          params: {
            sort: query.sort,
          },
        }),
      ),

    getPostById: (postId: string) =>
      apiRequest(() => client.get<GetPostByIdApiResponse>(`/posts/${postId}`)),

    getPostBySlug: (slug: string) =>
      apiRequest(() =>
        client.get<GetPostByIdApiResponse>(`/posts/slug/${slug}`),
      ),
  };
};
