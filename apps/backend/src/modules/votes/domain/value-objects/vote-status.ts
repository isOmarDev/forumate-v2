import { ValueObject, Result, success, fail } from '@forumate/core';

import { InvalidVoteStatusError } from '../errors/votes-errors';

export type VoteStatusName = 'UPVOTED' | 'DOWNVOTED' | 'NONE';
export type VoteValue = 1 | -1 | 0;

const VOTE_STATUS_NAMES: readonly VoteStatusName[] = [
  'UPVOTED',
  'DOWNVOTED',
  'NONE',
];

type VoteStatusProps = {
  value: VoteStatusName;
};

export class VoteStatus extends ValueObject<VoteStatusProps> {
  private constructor(props: VoteStatusProps) {
    super(props);
  }

  get value(): VoteStatusName {
    return this.props.value;
  }

  public static create(
    value: VoteStatusName,
  ): Result<VoteStatus, InvalidVoteStatusError> {
    if (!VOTE_STATUS_NAMES.includes(value)) {
      return fail(new InvalidVoteStatusError(value));
    }

    return success(new VoteStatus({ value }));
  }

  public static reconstituteFromValue(value: number): VoteStatus {
    switch (value) {
      case 1:
        return VoteStatus.upvoted();
      case -1:
        return VoteStatus.downvoted();
      case 0:
        return VoteStatus.unvoted();
      default:
        throw new Error(`Corrupt vote value: ${String(value)}`);
    }
  }

  public static upvoted(): VoteStatus {
    return new VoteStatus({ value: 'UPVOTED' });
  }

  public static downvoted(): VoteStatus {
    return new VoteStatus({ value: 'DOWNVOTED' });
  }

  public static unvoted(): VoteStatus {
    return new VoteStatus({ value: 'NONE' });
  }

  public toValue(): VoteValue {
    switch (this.value) {
      case 'UPVOTED':
        return 1;
      case 'DOWNVOTED':
        return -1;
      case 'NONE':
        return 0;
    }
  }

  public isUpvoted(): boolean {
    return this.value === 'UPVOTED';
  }

  public isDownvoted(): boolean {
    return this.value === 'DOWNVOTED';
  }

  public isNotVoted(): boolean {
    return this.value === 'NONE';
  }
}
