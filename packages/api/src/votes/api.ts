import axios from 'axios';

import { VoteOnPostInput } from './inputs';
import { VoteOnPostApiResponse } from './responses';

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