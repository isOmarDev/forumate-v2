import { apiRequest } from '../api-request';
import { HttpClient } from '../client';

import { VoteOnPostInput } from './inputs';
import { VoteOnPostApiResponse } from './responses';

export const createVotesApi = (client: HttpClient) => {
  return {
    // TODO: ensure all of these are called "inputs"
    voteOnPost: (input: VoteOnPostInput, authToken: string) =>
      apiRequest<VoteOnPostApiResponse>(() =>
        client.post(`/posts/${input.postId}/votes`, input, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ),
  };
};
