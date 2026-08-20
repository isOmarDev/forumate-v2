import axios from 'axios';

import { CreateUserInput } from './inputs';
import { CreateUserResponse, GetUserByEmailResponse } from './responses';

type AuthenticateResponse = any;

export const createUsersApi = (apiURL: string) => {
  return {
    authenticate: async (code: string) => {
      try {
        const successResponse = await axios.post(
          `${apiURL}/users/authenticate`,
          {
            code,
          },
        );
        return successResponse.data as AuthenticateResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as AuthenticateResponse;
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
    register: async (input: CreateUserInput) => {
      try {
        const successResponse = await axios.post(`${apiURL}/users`, input);
        return successResponse.data as CreateUserResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as CreateUserResponse;
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
    getUserByEmail: async (email: string) => {
      try {
        const successResponse = await axios.get(`${apiURL}/users`, {
          params: { email },
        });
        return successResponse.data as GetUserByEmailResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as GetUserByEmailResponse;
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
