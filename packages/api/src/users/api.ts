import { apiRequest } from '../api-request';
import { type HttpClient } from '../client';

import type { CreateUserInput } from './inputs';
import type {
  CreateUserApiResponse,
  GetUserByEmailApiResponse,
} from './responses';

export const createUsersApi = (client: HttpClient) => {
  return {
    authenticate: (code: string) =>
      apiRequest(() => client.post('/users/authenticate', { code })),

    register: (input: CreateUserInput) =>
      apiRequest(() => client.post<CreateUserApiResponse>('/users', input)),

    getUserByEmail: (email: string) =>
      apiRequest(() =>
        client.get<GetUserByEmailApiResponse>('/users', { params: { email } }),
      ),
  };
};
