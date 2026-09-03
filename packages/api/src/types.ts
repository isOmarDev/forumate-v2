import { errorCategories } from '@forumate/errors';

type FieldErrors = { field: string; message: string }[];

export type ApiError<U extends string> =
  U extends typeof errorCategories.VALIDATION
    ? { message: string; code: U; fields: FieldErrors }
    : { message: string; code: U; fields?: never };

export type SuccessApiResponse<D> = {
  success: true;
  data: D;
  status: number | null;
  error: null;
};

export type FailureApiResponse<E extends string> = {
  success: false;
  data: null;
  status: number | null;
  error: ApiError<E>;
};

export type ApiResponse<D, E extends string> =
  SuccessApiResponse<D> | FailureApiResponse<E>;
