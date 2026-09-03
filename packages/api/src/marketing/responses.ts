import { RequestErrorCode, ServerErrorCode } from '@forumate/errors';

import { ApiResponse } from '../types';

import { EmailSubscriptionDto } from './dtos';

// Errors
type EmailNotAddedToMailListError = 'EMAIL_NOT_ADDED_TO_MAILIST';

type RequestError = RequestErrorCode;
type ServerError = ServerErrorCode;
type NetworkError = 'NETWORK_ERROR';

// Add Email To List Api Response
export type AddEmailToListError =
  EmailNotAddedToMailListError | RequestError | ServerError | NetworkError;

export type AddEmailToListResponseData = {
  subscription: EmailSubscriptionDto;
};

export type AddEmailToListApiResponse = ApiResponse<
  AddEmailToListResponseData,
  AddEmailToListError
>;
