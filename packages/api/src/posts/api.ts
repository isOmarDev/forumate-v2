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
    create: (
      input: CreatePostInput,
      authToken: string,
    ): Promise<CreatePostApiResponse> =>
      apiRequest(() => client.post('/posts', input, getAuthHeaders(authToken))),

    getPosts: (sort: GetPostsQueryInput): Promise<GetPostsApiResponse> =>
      apiRequest(() => client.get('/posts', { params: sort })),

    getPostById: (postId: string): Promise<GetPostByIdApiResponse> =>
      apiRequest(() => client.get(`/posts/${postId}`)),

    getPostBySlug: (slug: string): Promise<GetPostByIdApiResponse> =>
      apiRequest(() => client.get(`/posts/slug/${slug}`)),
  };
};
