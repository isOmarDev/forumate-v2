import { ZodType } from 'zod';

import { Result, success, fail } from '@forumate/core/application';

export function parseWithSchema<TValue, TInstance, TError>(
  schema: ZodType<TValue>,
  input: unknown,
  toError: (message: string) => TError,
  build: (value: TValue) => TInstance,
): Result<TInstance, TError> {
  const result = schema.safeParse(input);

  if (!result.success) {
    return fail(toError(result.error.issues[0].message));
  }

  return success(build(result.data));
}
