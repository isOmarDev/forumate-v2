import { MarketingErrorCode } from '../../../errors/src/domain/marketing';
import { ApiResponse } from '../types';

import { EmailSubscriptionDto } from './dtos';

// Add Email To List Api Response
export type AddEmailToListError = MarketingErrorCode;

export type AddEmailToListResponseData = {
  subscription: EmailSubscriptionDto;
};

export type AddEmailToListApiResponse = ApiResponse<
  AddEmailToListResponseData,
  AddEmailToListError
>;
