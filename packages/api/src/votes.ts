import axios from 'axios';

import { ApiResponse } from '.';

import {
  AnyServerError,
  MissingRequestParamsError,
} from '@forumate/errors/server';
import { AnyApplicationError } from '@forumate/errors/application';
import { Request } from '@forumate/core';

// Types
export type VoteType = 'upvote' | 'downvote';

// Inputs
// TODO: separate all inputs from commands; they're different - do this for all domains
export type VoteOnCommentInput = {
  commentId: string;
  voteType: VoteType;
  memberId: string;
};

export type VoteOnPostInput = {
  postId: string;
  voteType: VoteType;
  memberId: string;
};

// DTOs
export type PostVoteDTO = {
  postId: string;
  memberId: string;
  voteType: VoteType;
};

// Commands
export class UpdateMemberReputationScoreCommand {
  constructor(
    public readonly props: {
      memberId: string;
    },
  ) {}
}

export class VoteOnCommentCommand {
  constructor(public props: VoteOnCommentInput) {}

  static fromRequest(body: Request['body']) {
    const { voteType, commentId, memberId } = body;

    if (!commentId) {
      throw new MissingRequestParamsError(['commentId']);
    }

    if (!voteType) {
      throw new MissingRequestParamsError(['voteType']);
    }

    if (!memberId) {
      throw new MissingRequestParamsError(['memberId']);
    }

    return new VoteOnCommentCommand({ ...body });
  }
}

export class VoteOnPostCommand {
  constructor(public props: VoteOnPostInput) {}

  static fromRequest(body: Request['body']) {
    const { voteType, postId, memberId } = body;

    if (!postId) {
      throw new MissingRequestParamsError(['postId']);
    }

    if (!voteType) {
      throw new MissingRequestParamsError(['voteType']);
    }

    if (!memberId) {
      throw new MissingRequestParamsError(['memberId']);
    }

    return new VoteOnCommentCommand({ ...body });
  }
}

// Api Responses
export type VoteOnPostApiResponse = ApiResponse<
  PostVoteDTO,
  VoteErrors['type']
>;

export type AnyVotesApiResponse = VoteOnPostApiResponse;

export type VoteErrors = AnyServerError | AnyApplicationError;

export const createVotesApi = (apiUrl: string) => {
  return {
    // TODO: ensure all of these are called "inputs"
    voteOnPost: async (input: VoteOnPostInput, authToken: string) => {
      try {
        const successResponse = await axios.post(
          `${apiUrl}/posts/${input.postId}/votes`,
          input,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          },
        );
        return successResponse.data as VoteOnPostApiResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as VoteOnPostApiResponse;
        }

        return {
          data: null,
          error: {
            message: 'Network or server unreachable',
            code: 'NetworkError',
          },
          success: false,
        };
      }
    },
  };
};
