import { apiRequest } from '../api-request';
import { type HttpClient } from '../client';

import type { AddEmailToListApiResponse } from './responses';

export const createMarketingApi = (client: HttpClient) => {
  return {
    addEmailToList: (email: string) =>
      apiRequest(() =>
        client.post<AddEmailToListApiResponse>('/marketing', { email }),
      ),
  };
};
