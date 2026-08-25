import { apiRequest } from '../api-request';
import { HttpClient } from '../client';

import { AddEmailToListApiResponse } from './responses';

export const createMarketingApi = (client: HttpClient) => {
  return {
    addEmailToList: (email: string) =>
      apiRequest(() =>
        client.post<AddEmailToListApiResponse>('/marketing', { email }),
      ),
  };
};
