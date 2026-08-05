export { CustomError } from './custom';
export { ApplicationErrors, type ApplicationEntity } from './application';
export { ServerErrors } from './server';

export type GenericApplicationOrServerError =
  | import('./application').ApplicationErrors.AnyApplicationError
  | import('./server').ServerErrors.AnyServerError;
