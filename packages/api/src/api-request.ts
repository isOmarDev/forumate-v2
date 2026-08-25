import axios, { AxiosResponse } from 'axios';

import { ApiResponse, GenericErrors, TransportErrors } from './types';

export async function apiRequest<T, U extends string>(
  request: () => Promise<AxiosResponse<ApiResponse<T, U>>>,
): Promise<ApiResponse<T, U | TransportErrors | GenericErrors>> {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.data as ApiResponse<T, U | GenericErrors>;
      }

      if (error.code === 'ECONNABORTED') {
        return {
          data: null,
          success: false,
          statusCode: null,
          error: { message: 'Request timed out', code: 'TIMEOUT_ERROR' },
        };
      }

      if (error.request) {
        return {
          success: false,
          data: null,
          statusCode: null,
          error: {
            message: 'No response received from server',
            code: 'NETWORK_ERROR',
          },
        };
      }

      return {
        success: false,
        data: null,
        statusCode: null,
        error: { message: error.message, code: 'REQUEST_ERROR' },
      };
    }

    return {
      success: false,
      data: null,
      statusCode: null,
      error: { message: 'Unexpected error', code: 'UNKNOWN_ERROR' },
    };
  }
}
