import axios from 'axios';

import { getAuthHeaders } from '..';
import { CreateMemberInput } from './inputs';
import {
  CreateMemberApiResponse,
  GetMemberDetailsApiResponse,
} from './responses';

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