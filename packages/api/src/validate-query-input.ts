import { z } from 'zod';

import { fail, type Result, success } from '@forumate/core/application';
import { InvalidRequestQueryParamsError } from '@forumate/errors';

export function validateQueryInput<T>(
  schema: z.ZodType<T>,
  input: unknown,
): Result<T, InvalidRequestQueryParamsError> {
  const result = schema.safeParse(input);

  if (!result.success) {
    const invalidParams = [
      ...new Set(result.error.issues.map((issue) => issue.path.join('.'))),
    ];

    return fail(new InvalidRequestQueryParamsError(invalidParams));
  }

  return success(result.data);
}
