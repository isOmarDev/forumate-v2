import { apiRequest } from '../api-request';
import { HttpClient } from '../client';

import { CreateUserInput } from './inputs';
import { CreateUserApiResponse, GetUserByEmailApiResponse } from './responses';

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
