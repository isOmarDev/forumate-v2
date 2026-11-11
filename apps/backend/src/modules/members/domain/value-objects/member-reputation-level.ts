import { Result, ValueObject, fail, success } from '@forumate/core';

import { InvalidReputationLevelError } from '../errors/member-errors';

export const reputationLevel = {
  level1: 'level1',
  level2: 'level2',
  level3: 'level3',
} as const;

export type ReputationLevel =
  (typeof reputationLevel)[keyof typeof reputationLevel];

export const LEVEL_2_MIN_SCORE = 5;
export const LEVEL_3_MIN_SCORE = 10;

const LEVEL_CONFIG: Record<
  ReputationLevel,
  { order: number; minScore: number }
> = {
  [reputationLevel.level1]: { order: 1, minScore: Number.NEGATIVE_INFINITY },
  [reputationLevel.level2]: { order: 2, minScore: LEVEL_2_MIN_SCORE },
  [reputationLevel.level3]: { order: 3, minScore: LEVEL_3_MIN_SCORE },
} as const;

const LEVELS_HIGH_TO_LOW = (
  Object.keys(LEVEL_CONFIG) as ReputationLevel[]
).reverse();

const isReputationLevel = (value: string): value is ReputationLevel =>
  Object.prototype.hasOwnProperty.call(LEVEL_CONFIG, value);

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
    return LEVEL_CONFIG[this.props.value].order;
  }

  public static create(
    value: ReputationLevel,
  ): Result<MemberReputationLevel, InvalidReputationLevelError> {
    if (!isReputationLevel(value)) {
      return fail(new InvalidReputationLevelError(value));
    }

    return success(new MemberReputationLevel({ value }));
  }

  public static reconstitute(value: ReputationLevel): MemberReputationLevel {
    return new MemberReputationLevel({ value });
  }

  public static initial(): MemberReputationLevel {
    return new MemberReputationLevel({ value: reputationLevel.level1 });
  }

  public static fromScore(score: number): MemberReputationLevel {
    const level =
      LEVELS_HIGH_TO_LOW.find((l) => score >= LEVEL_CONFIG[l].minScore) ??
      reputationLevel.level1;

    return new MemberReputationLevel({ value: level });
  }

  public isAtLeast(required: ReputationLevel): boolean {
    return this.numericValue >= LEVEL_CONFIG[required].order;
  }

  public isLowerThan(other: MemberReputationLevel): boolean {
    return this.numericValue < other.numericValue;
  }

  public isHigherThan(other: MemberReputationLevel): boolean {
    return this.numericValue > other.numericValue;
  }
}
