import { apiRequest } from '../api-request';
import { getAuthHeaders, type HttpClient } from '../client';

import type { CreateMemberInput } from './inputs';
import type {
  CreateMemberApiResponse,
  GetMemberDetailsApiResponse,
} from './responses';

export const createMembersApi = (client: HttpClient) => {
  return {
    register: (input: CreateMemberInput, authToken: string) =>
      apiRequest(() =>
        client.post<CreateMemberApiResponse>(
          '/members',
          input,
          getAuthHeaders(authToken),
        ),
      ),

    getMemberDetails: (authToken: string) =>
      apiRequest(() =>
        client.get<GetMemberDetailsApiResponse>(
          '/members/me',
          getAuthHeaders(authToken),
        ),
      ),
  };
};
