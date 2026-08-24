import { apiRequest } from '../api-request';
import { getAuthHeaders } from '../client';
import { HttpClient } from '../client';

import { CreateMemberInput } from './inputs';
import {
  CreateMemberApiResponse,
  GetMemberDetailsApiResponse,
} from './responses';

export const createMembersApi = (client: HttpClient) => {
  return {
    register: (input: CreateMemberInput, authToken: string) =>
      apiRequest(() =>
        client.post('/members', input, getAuthHeaders(authToken)),
      ),

    getMemberDetails: (authToken: string) =>
      apiRequest(() => client.get('/members/me', getAuthHeaders(authToken))),
  };
};
