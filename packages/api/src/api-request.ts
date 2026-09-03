import axios, { AxiosResponse } from 'axios';

import { NetworkErrorCode, networkErrorCodes } from '@forumate/errors/network';

import { ApiResponse } from './types';

export async function apiRequest<T, U extends string>(
  request: () => Promise<AxiosResponse<ApiResponse<T, U>>>,
): Promise<ApiResponse<T, U | NetworkErrorCode>> {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.data as ApiResponse<T, U>;
      }

      if (error.code === 'ECONNABORTED') {
        return {
          data: null,
          success: false,
          status: null,
          error: {
            message: 'Request timed out',
            code: networkErrorCodes.timeoutError,
          },
        };
      }

      if (error.request) {
        return {
          success: false,
          data: null,
          status: null,
          error: {
            message: 'No response received from server',
            code: networkErrorCodes.networkError,
          },
        };
      }

      return {
        success: false,
        data: null,
        status: null,
        error: {
          message: error.message,
          code: networkErrorCodes.requestError,
        },
      };
    }

    return {
      success: false,
      data: null,
      status: null,
      error: {
        message: 'Unexpected error',
        code: networkErrorCodes.unknownError,
      },
    };
  }
}
