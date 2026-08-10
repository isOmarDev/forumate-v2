import axios from 'axios';
import { z } from 'zod';

import { MemberDTO } from './members';
import { ApiResponse, getAuthHeaders } from './index';

import { Request, Result } from '@forumate/core';
import {
  AnyServerError,
  InvalidRequestParamsError,
  MissingRequestParamsError,
} from '@forumate/errors/server';
import {
  AnyApplicationError,
  ValidationError,
} from '@forumate/errors/application';

// Inputs
export type PostType = 'link' | 'text';

export type CreatePostInput = {
  title: string;
  memberId: string;
  content?: string;
  link?: string;
  postType: PostType;
};

// Queries
export class GetPostByIdQuery {
  constructor(private props: { postId: string }) {}

  static fromRequest(req: Request) {
    const postId = req['query'].postId || req['params'].postId;

    if (!postId) {
      throw new MissingRequestParamsError(['postId']);
    }

    return new GetPostByIdQuery({ postId: postId as string });
  }

  get postId() {
    return this.props.postId;
  }
}

export type GetPostsQueryOption = 'popular' | 'recent';
export type GetPostsQueryInput = { sort: GetPostsQueryOption };
export class GetPostsQuery {
  constructor(private props: GetPostsQueryInput) {}

  public static create(option: GetPostsQueryOption) {
    return new GetPostsQuery({ sort: option });
  }

  static fromRequest(query: Request['query']) {
    const { sort } = query;

    if (!sort) {
      throw new MissingRequestParamsError(['sort']);
    }

    if (sort !== 'recent' && sort !== 'popular') {
      throw new InvalidRequestParamsError(['sort']);
    }

    return new GetPostsQuery({ sort });
  }

  get sort() {
    return this.props.sort;
  }
}

// Commands
export class CreatePostCommand {
  private props: CreatePostInput;

  private constructor(props: CreatePostInput) {
    this.props = props;
  }

  getProps() {
    return this.props;
  }

  public static create(
    input: CreatePostInput,
  ): Result<CreatePostCommand, ValidationError> {
    const schema = z
      .object({
        title: z.string().min(6, 'Title is required'),
        memberId: z.string(),
        content: z
          .string()
          .min(5, 'Content must be at least 5 characters')
          .optional(),
        link: z.string().url('Link must be a valid URL').optional(),
        postType: z.enum(['text', 'link']),
      })
      .refine(
        (data) => {
          if (data.postType === 'text' && !data.content) {
            return false;
          }
          if (data.postType === 'link' && !data.link) {
            return false;
          }
          return true;
        },
        {
          message:
            'Content required for text posts, link required for link posts',
        },
      );

    try {
      const result = schema.parse(input);
      return Result.success(new CreatePostCommand(result as CreatePostInput));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingKeys = error.errors
          .map((err) => err.path.join('.'))
          .join(', ');
        return Result.failure(
          new ValidationError(`Missing or invalid fields: ${missingKeys}`),
        );
      }
      return Result.failure(new ValidationError('Validation error'));
    }
  }

  public static fromRequest(
    body: Request['body'],
  ): Result<CreatePostCommand, MissingRequestParamsError> {
    const { title, postType, memberId } = body;

    if (!memberId) {
      return Result.failure(new MissingRequestParamsError(['memberId']));
    }

    if (!title) {
      return Result.failure(new MissingRequestParamsError(['title']));
    }

    if (!postType) {
      return Result.failure(new MissingRequestParamsError(['postType']));
    }

    return Result.success(new CreatePostCommand({ ...body }));
  }
}

// DTOs
export type PostDTO = {
  id: string;
  postType: string;
  title: string;
  content?: string;
  link?: string;
  dateCreated: string;
  member: MemberDTO;
  numComments: number;
  voteScore: number;
  lastUpdated: string;
  slug: string;
};

// Errors
export type GetPostDetailsError = '';
export type GetPostsErrors = '';
export type CreatePostErrors = '';
export type GetPostByIdErrors = '';
export type AnyPostError = AnyServerError | AnyApplicationError;

// API Responses
export type GetPostsApiResponse = ApiResponse<PostDTO[], GetPostsErrors>;
export type CreatePostApiResponse = ApiResponse<PostDTO, CreatePostErrors>;
export type GetPostByIdApiResponse = ApiResponse<PostDTO, GetPostByIdErrors>;
export type GetPostDetailsResponse = ApiResponse<PostDTO, GetPostDetailsError>;
export type AnyPostsApiResponse =
  GetPostsApiResponse | CreatePostApiResponse | AnyPostError; // TODO: this pattern throughout
// TODO: tidy functional errors; see users.ts

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
          data: [],
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
