import axios from 'axios';

import { ApiResponse, getAuthHeaders } from '.';
import { DecodedIdToken } from './users';

import { Request, Result, fail, success } from '@forumate/core';
import {
  AnyServerError,
  MissingRequestParamsError,
} from '@forumate/errors/server';
import { AnyApplicationError } from '@forumate/errors/application';

export const ReputationLevel = {
  Level1: 'Level1',
  Level2: 'Level2',
  Level3: 'Level3',
} as const;

export type ReputationLevel =
  (typeof ReputationLevel)[keyof typeof ReputationLevel];

export type MemberDTO = {
  userId: string;
  memberId: string;
  username: string;
  reputationLevel: ReputationLevel;
  reputationScore: number;
};

export type CreateMemberInput = {
  username: string;
  email: string;
  userId: string;
};

export class CreateMemberCommand {
  private constructor(public readonly props: CreateMemberInput) {}

  static create(
    decodedToken: DecodedIdToken | undefined,
    body: Request['body'],
  ): Result<CreateMemberCommand, MissingRequestParamsError> {
    const email = decodedToken?.email || body.email;
    const userId = decodedToken?.uid || body.userId;
    const username = body.username;

    if (!email) {
      return fail(new MissingRequestParamsError(['email']));
    }

    if (!userId) {
      return fail(new MissingRequestParamsError(['userId']));
    }

    if (!username) {
      return fail(new MissingRequestParamsError(['username']));
    }

    return success(
      new CreateMemberCommand({
        userId,
        username,
        email,
      }),
    );
  }

  static fromRequest(
    decodedToken: DecodedIdToken | undefined,
    body: Request['body'],
  ): Result<CreateMemberCommand, MissingRequestParamsError> {
    return this.create(decodedToken, body);
  }
}

export type UsernameAlreadyTakenError = 'UsernameAlreadyTaken';

export type CreateMemberError = UsernameAlreadyTakenError;

export type AnyMemberError =
  CreateMemberError | AnyApplicationError['type'] | AnyServerError['type'];

export type CreateMemberApiResponse = ApiResponse<
  MemberDTO,
  CreateMemberError | 'NetworkError'
>;

export type GetMemberDetailsApiResponse = ApiResponse<
  MemberDTO,
  AnyMemberError
>;

export type AnyMemberAPIResponse = CreateMemberApiResponse;

export const createMembersApi = (apiURL: string) => {
  return {
    register: async (input: CreateMemberInput, authToken: string) => {
      try {
        const response = await axios.post(
          `${apiURL}/members`,
          input,
          getAuthHeaders(authToken),
        );

        return response.data as CreateMemberApiResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as CreateMemberApiResponse;
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

    getMemberDetails: async (authToken: string) => {
      try {
        const response = await axios.get(
          `${apiURL}/members/me`,
          getAuthHeaders(authToken),
        );

        return response.data as GetMemberDetailsApiResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as GetMemberDetailsApiResponse;
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
