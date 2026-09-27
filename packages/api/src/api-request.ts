import axios, { AxiosResponse } from 'axios';

import { GenericErrorCode, networkErrorCodes } from '@forumate/errors';

import { ApiResponse } from './types';

export async function apiRequest<TData, TDomainError extends string>(
  request: () => Promise<AxiosResponse<ApiResponse<TData, TDomainError>>>,
): Promise<ApiResponse<TData, TDomainError | GenericErrorCode>> {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.data as ApiResponse<
          TData,
          TDomainError | GenericErrorCode
        >;
      }

      if (error.code === 'ECONNABORTED') {
        return {
          data: null,
          success: false,
          status: null,
          error: {
            code: networkErrorCodes.TIMEOUT_ERROR,
            message: 'Request timed out',
          },
        };
      }

      if (error.request) {
        return {
          success: false,
          data: null,
          status: null,
          error: {
            code: networkErrorCodes.NETWORK_ERROR,
            message: 'No response received from server',
          },
        };
      }

      return {
        success: false,
        data: null,
        status: null,
        error: {
          code: networkErrorCodes.REQUEST_ERROR,
          message: error.message,
        },
      };
    }

    return {
      success: false,
      data: null,
      status: null,
      error: {
        code: networkErrorCodes.UNKNOWN_ERROR,
        message: 'Unexpected error',
      },
    };
  }
}
