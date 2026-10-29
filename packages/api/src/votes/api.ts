import { apiRequest } from '../api-request';
import { type HttpClient } from '../client';

import type { VoteOnCommentInput, VoteOnPostInput } from './inputs';
import type {
  VoteOnCommentApiResponse,
  VoteOnPostApiResponse,
} from './responses';

export const createVotesApi = (client: HttpClient) => {
  return {
    voteOnPost: ({ postId, ...input }: VoteOnPostInput, authToken: string) =>
      apiRequest(() =>
        client.post<VoteOnPostApiResponse>(`/posts/${postId}/vote`, input, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ),

    voteOnComment: (
      { commentId, ...input }: VoteOnCommentInput,
      authToken: string,
    ) =>
      apiRequest(() =>
        client.post<VoteOnCommentApiResponse>(
          `/comments/${commentId}/vote`,
          input,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          },
        ),
      ),
  };
};
