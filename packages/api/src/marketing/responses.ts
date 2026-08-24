import { ApiResponse, GenericErrors } from '../types';

import { EmailSubscriberDto } from './dtos';

type EmailNotAddedToMailListError = 'EMAIL_NOT_ADDED_TO_MAILIST';

export type AddEmailToListErrors = EmailNotAddedToMailListError | GenericErrors;
export type AddEmailToListResponse = ApiResponse<
  { subscriber: EmailSubscriberDto },
  AddEmailToListErrors
>;

export type MarketingResponse = AddEmailToListResponse;
