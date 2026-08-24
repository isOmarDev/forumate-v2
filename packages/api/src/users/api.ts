import { apiRequest } from '../api-request';
import { HttpClient } from '../client';

import { CreateUserInput } from './inputs';
import { CreateUserResponse, GetUserByEmailResponse } from './responses';

type AuthenticateResponse = any;

export const createUsersApi = (client: HttpClient) => {
  return {
    authenticate: (code: string) =>
      apiRequest(() => client.post('/users/authenticate', { code })),

    register: (input: CreateUserInput) =>
      apiRequest(() => client.post('/users', input)),

    getUserByEmail: (email: string) =>
      apiRequest(() => client.get('/users', { params: { email } })),
  };
};
