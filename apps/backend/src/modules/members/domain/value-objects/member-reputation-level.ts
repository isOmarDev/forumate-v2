import { Result, ValueObject, fail, success } from '@forumate/core';

import { InvalidReputationLevelError } from '../errors/member-errors';

export enum ReputationLevel {
  Level1 = 'Level1',
  Level2 = 'Level2',
  Level3 = 'Level3',
}

const LEVEL_ORDER: Record<ReputationLevel, number> = {
  [ReputationLevel.Level1]: 1,
  [ReputationLevel.Level2]: 2,
  [ReputationLevel.Level3]: 3,
};

interface ReputationLevelProps {
  value: ReputationLevel;
}

export class MemberReputationLevel extends ValueObject<ReputationLevelProps> {
  private constructor(props: ReputationLevelProps) {
    super(props);
  }

  get value(): ReputationLevel {
    return this.props.value;
  }

  get numericValue(): number {
    return LEVEL_ORDER[this.props.value];
  }

  public static create(
    value: ReputationLevel,
  ): Result<MemberReputationLevel, InvalidReputationLevelError> {
    if (!(value in LEVEL_ORDER)) {
      return fail(new InvalidReputationLevelError(value));
    }

    return success(new MemberReputationLevel({ value }));
  }

  public static reconstitute(value: ReputationLevel): MemberReputationLevel {
    return new MemberReputationLevel({ value });
  }

  public static initial(): MemberReputationLevel {
    return new MemberReputationLevel({ value: ReputationLevel.Level1 });
  }

  public isAtLeast(threshold: number): boolean {
    return this.numericValue >= threshold;
  }
}
