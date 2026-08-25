import { apiRequest } from '../api-request';
import { getAuthHeaders } from '../client';
import { HttpClient } from '../client';

import { CreatePostInput } from './inputs';
import { GetPostsQueryInput } from './queries';
import {
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

    getPosts: (sort: GetPostsQueryInput) =>
      apiRequest(() =>
        client.get<GetPostsApiResponse>('/posts', { params: sort }),
      ),

    getPostById: (postId: string) =>
      apiRequest(() => client.get<GetPostByIdApiResponse>(`/posts/${postId}`)),

    getPostBySlug: (slug: string) =>
      apiRequest(() =>
        client.get<GetPostByIdApiResponse>(`/posts/slug/${slug}`),
      ),
  };
};
