import { ApiResponse, GenericErrors } from '..';

import { EmailSubscriber } from './dtos';

type EmailNotAddedToMailListError = 'EmailNotAddedToMailList';

export type AddEmailToListErrors = EmailNotAddedToMailListError | GenericErrors;
export type AddEmailToListResponse = ApiResponse<
  { subscription: EmailSubscriber },
  AddEmailToListErrors
>;

export type MarketingResponse = AddEmailToListResponse;