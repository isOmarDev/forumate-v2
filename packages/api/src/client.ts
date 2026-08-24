import axios, { CreateAxiosDefaults } from 'axios';

import { createCommentsApi } from './comments';
import { createMarketingApi } from './marketing';
import { createMembersApi } from './members';
import { createPostsApi } from './posts';
import { createUsersApi } from './users';
import { createVotesApi } from './votes';

// Auth headers
export const getAuthHeaders = (token?: string) => ({
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {},
});

// Http client
const createHttpClient = (config: CreateAxiosDefaults) => {
  const instance = axios.create({
    ...config,
    timeout: config.timeout ?? 8000,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });

  return instance;
};

export type HttpClient = ReturnType<typeof createHttpClient>;

// Api client
export const createApiClient = (config: CreateAxiosDefaults) => {
  const httpClient = createHttpClient(config);

  return {
    users: createUsersApi(httpClient),
    posts: createPostsApi(httpClient),
    marketing: createMarketingApi(httpClient),
    members: createMembersApi(httpClient),
    comments: createCommentsApi(httpClient),
    votes: createVotesApi(httpClient),
  };
};

export type ApiClient = ReturnType<typeof createApiClient>;
