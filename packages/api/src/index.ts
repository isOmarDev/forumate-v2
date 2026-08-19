import { createCommentsApi } from './comments';
import { createMarketingApi } from './marketing';
import { createMembersApi } from './members';
import { createPostsApi } from './posts';
import { createUsersApi } from './users';
import { createVotesApi } from './votes';

export type Error<U> = {
  message: string;
  code: U;
};

export type ApiResponse<T, U extends string> =
  | {
      success: true;
      data: T;
      error: null;
    }
  | {
      success: false;
      data: null;
      error: Error<U>;
    };

export type ValidationError = 'ValidationError';
export type ServerError = 'ServerError';
export type ClientError = 'ClientError';

export type GenericErrors = ValidationError | ServerError | ClientError;

export const createApiClient = (apiUrl: string) => {
  return {
    users: createUsersApi(apiUrl),
    posts: createPostsApi(apiUrl),
    marketing: createMarketingApi(apiUrl),
    members: createMembersApi(apiUrl),
    comments: createCommentsApi(apiUrl),
    votes: createVotesApi(apiUrl),
  };
};

export const getAuthHeaders = (token?: string) => ({
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {},
});

export type ApiClient = ReturnType<typeof createApiClient>;

export * from './comments';
export * from './marketing';
export * from './members';
export * from './posts';
export * from './users';
export * from './votes';
