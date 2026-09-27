import { z } from 'zod';

import { Result } from '@forumate/core/application';
import { ValueObject } from '@forumate/core/domain';

import { parseWithSchema } from '../../../../shared/validation/parse-with-schema';
import { InvalidMemberUsernameError } from '../errors/member-errors';

const memberUsernameSchema = z
  .string()
  .min(5, 'Username must be at least 5 characters')
  .max(15, 'Username must be at most 15 characters')
  .toLowerCase()
  .regex(
    /^[a-zA-Z0-9]+$/,
    'Username can only contain letters and numbers without spaces',
  );

interface MemberUsernameProps {
  value: string;
}

export class MemberUsername extends ValueObject<MemberUsernameProps> {
  private constructor(props: MemberUsernameProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  public static create(
    input: string,
  ): Result<MemberUsername, InvalidMemberUsernameError> {
    return parseWithSchema(
      memberUsernameSchema,
      input,
      (message) => new InvalidMemberUsernameError(message),
      (data) => new MemberUsername({ value: data }),
    );
  }

  public static reconstitute(value: string): MemberUsername {
    return new MemberUsername({ value });
  }
}
