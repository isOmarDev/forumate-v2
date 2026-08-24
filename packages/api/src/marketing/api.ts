import { apiRequest } from '../api-request';
import { HttpClient } from '../client';

import { AddEmailToListResponse } from './responses';

export const createMarketingApi = (client: HttpClient) => {
  return {
    addEmailToList: (email: string) =>
      apiRequest(() => client.post('/marketing', { email })),
  };
};
