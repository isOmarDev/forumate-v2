import axios from 'axios';

import { ApiResponse, getAuthHeaders } from '.';
import { MemberDTO } from './members';
import { DecodedIdToken } from './users';

import { Result, success, Request, fail } from '@forumate/core';
import { MissingRequestParamsError } from '@forumate/errors/server';
import { ValidationError } from '@forumate/errors/application';

// Inputs
export type PostCommentInput = {
  postId: string;
  text: string;
  memberId: string;
  parentCommentId?: string;
};

// DTOs
export type CommentDTO = {
  id: string;
  postId: string;
  commentId: string;
  parentCommentId?: string;
  text: string;
  member: MemberDTO;
  createdAt: string | Date;
  childComments: CommentDTO[];
  points: number;
};

// Commands
export class PostCommentCommand {
  private constructor(public readonly props: PostCommentInput) {}

  static create(
    input: PostCommentInput,
  ): Result<PostCommentCommand, ValidationError> {
    const { postId, text, memberId } = input;

    if (!postId) {
      return fail(new ValidationError('postId'));
    }

    if (!text || text.length > 1000) {
      return fail(new ValidationError('text'));
    }

    if (!memberId) {
      return fail(new ValidationError('memberId'));
    }

    return success(new PostCommentCommand(input));
  }

  static fromRequest(
    body: Request['body'],
    _decodedToken: DecodedIdToken | undefined,
  ): Result<PostCommentCommand, MissingRequestParamsError> {
    const input: PostCommentInput = {
      postId: body.postId,
      text: body.text,
      parentCommentId: body.parentCommentId,
      memberId: body.memberId,
    };

    return this.create(input);
  }

  // static create(
  //   decodedToken: UserTypes.DecodedIdToken | undefined,
  //   body: Request['body']
  // ): Result<PostCommentCommand, MissingRequestParamsError> {
  //   const userId = decodedToken?.uid || body.userId;
  //   const postId = body.postId;
  //   const text = body.text;
  //   const parentCommentId = body.parentCommentId;

  //   console.log(decodedToken, body)

  //   if (!postId) {
  //     return fail(new MissingRequestParamsError(["postId"]));
  //   }
  //   if (!text) {
  //     return fail(new MissingRequestParamsError(["text"]));
  //   }
  //   if (!userId) {
  //     return fail(new MissingRequestParamsError(["userId"]));
  //   }

  //   return success(new PostCommentCommand({
  //     postId,
  //     text,
  //     userId,
  //     parentCommentId
  //   }));
  // }
}

// API Responses
export type GetCommentsByPostIdApiResponse = ApiResponse<
  CommentDTO[],
  'COMMENTS_NOT_FOUND'
>;

export type PostCommentApiResponse = ApiResponse<
  CommentDTO,
  'POST_NOT_FOUND' | 'INVALID_COMMENT'
>;

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
