import {
  commentErrorCodes,
  marketingErrorCodes,
  memberErrorCodes,
  postErrorCodes,
  userErrorCodes,
} from './domain';
import { networkErrorCodes } from './network';
import { requestErrorCodes } from './request';
import { serverErrorCodes } from './server';

export const domainErrorCodes = {
  ...userErrorCodes,
  ...memberErrorCodes,
  ...commentErrorCodes,
  ...postErrorCodes,
  ...marketingErrorCodes,
} as const;

export const infraErrorCodes = {
  ...serverErrorCodes,
  ...networkErrorCodes,
} as const;

export const genericErrorCodes = {
  ...requestErrorCodes,
  ...infraErrorCodes,
} as const;

export const errorCodes = {
  ...genericErrorCodes,
  ...domainErrorCodes,
} as const;

export type ErrorCodeOf<T extends Record<string, string>> = T[keyof T];

export type DomainErrorCode = ErrorCodeOf<typeof domainErrorCodes>;
export type InfraErrorCode = ErrorCodeOf<typeof infraErrorCodes>;
export type GenericErrorCode = ErrorCodeOf<typeof genericErrorCodes>;
export type ErrorCode = ErrorCodeOf<typeof errorCodes>;
