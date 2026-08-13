import axios from 'axios';

import { getAuthHeaders } from '..';

import { CreatePostInput } from './inputs';
import { GetPostsQueryInput } from './queries';
import {
  CreatePostApiResponse,
  GetPostByIdApiResponse,
  GetPostsApiResponse,
} from './responses';

export const createPostsApi = (apiURL: string) => {
  return {
    create: async (
      input: CreatePostInput,
      authToken: string,
    ): Promise<CreatePostApiResponse> => {
      try {
        const successResponse = await axios.post(
          `${apiURL}/posts/new`,
          input,
          getAuthHeaders(authToken),
        );
        return successResponse.data as CreatePostApiResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as CreatePostApiResponse;
        }
        return {
          data: null,
          error: { code: '', message: '' },
          success: false,
        };
      }
    },
    getPosts: async (
      sort: GetPostsQueryInput,
    ): Promise<GetPostsApiResponse> => {
      try {
        const successResponse = await axios.get(
          `${apiURL}/posts?sort=${sort.sort}`,
        );
        return successResponse.data as GetPostsApiResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as GetPostsApiResponse;
        }

        return {
          data: null,
          error: { code: '', message: '' },
          success: false,
        };
      }
    },
    getPostById: async (postId: string): Promise<GetPostByIdApiResponse> => {
      try {
        const successResponse = await axios.get(`${apiURL}/posts/${postId}`);
        return successResponse.data as GetPostByIdApiResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as GetPostByIdApiResponse;
        }
        return {
          data: null,
          error: { code: '', message: '' },
          success: false,
        };
      }
    },
    getPostBySlug: async (slug: string): Promise<GetPostByIdApiResponse> => {
      try {
        const response = await axios.get(`${apiURL}/posts/slug/${slug}`);
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as GetPostByIdApiResponse;
        }
        return {
          data: null,
          error: { code: '', message: 'Failed to fetch post' },
          success: false,
        };
      }
    },
  };
};