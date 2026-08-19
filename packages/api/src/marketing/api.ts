import axios from 'axios';

import { AddEmailToListResponse } from './responses';

export const createMarketingApi = (apiUrl: string) => {
  return {
    addEmailToList: async (email: string) => {
      try {
        const response = await axios.post(`${apiUrl}/marketing`, {
          email,
        });
        return response.data as AddEmailToListResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as AddEmailToListResponse;
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