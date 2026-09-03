import { apiRequest } from '../api-request';
import { type HttpClient } from '../client';

import type { VoteOnPostInput } from './inputs';
import type { VoteOnPostApiResponse } from './responses';

export const createVotesApi = (client: HttpClient) => {
  return {
    // TODO: ensure all of these are called "inputs"
    voteOnPost: (input: VoteOnPostInput, authToken: string) =>
      apiRequest(() =>
        client.post<VoteOnPostApiResponse>(
          `/posts/${input.postId}/votes`,
          input,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          },
        ),
      ),
  };
};
