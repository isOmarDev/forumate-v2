import { randomUUID } from 'node:crypto';

import { AggregateRoot, Result, success, fail } from '@forumate/core';

import { InsufficientMemberLevelError } from '../errors/member-errors';
import { MemberReputationLevelUpgraded } from '../events/member-reputation-level-upgraded';
import { MemberReputationChanged } from '../events/member-reputation-score-changed';
import {
  MemberReputationLevel,
  ReputationLevel,
} from '../value-objects/member-reputation-level';
import { MemberUsername } from '../value-objects/member-username';

interface CreateMemberInput {
  userId: string;
  username: MemberUsername;
}

interface MemberProps {
  id: string;
  userId: string;
  username: MemberUsername;
  reputationScore: number;
  reputationLevel: MemberReputationLevel;
}

export class Member extends AggregateRoot {
  private constructor(private props: MemberProps) {
    super();
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get reputationScore(): number {
    return this.props.reputationScore;
  }

  get username(): MemberUsername {
    return this.props.username;
  }

  get reputationLevel(): MemberReputationLevel {
    return this.props.reputationLevel;
  }

  get reputationLevelNumeric(): number {
    return this.props.reputationLevel.numericValue;
  }

  public static create(input: CreateMemberInput): Result<Member, never> {
    return success(
      new Member({
        ...input,
        id: randomUUID(),
        reputationScore: 0,
        reputationLevel: MemberReputationLevel.initial(),
      }),
    );
  }

  public static reconstitute(props: MemberProps): Member {
    return new Member(props);
  }

  public updateReputation(scoreChange: number) {
    const newScore = this.props.reputationScore + scoreChange;
    const previousLevel = this.props.reputationLevel;
    const newLevel = MemberReputationLevel.fromScore(newScore);

    this.props.reputationScore = newScore;
    this.props.reputationLevel = newLevel;

    this.addDomainEvent(
      new MemberReputationChanged({
        memberId: this.id,
        score: newScore,
        level: newLevel.value,
        previousLevel: previousLevel.value,
      }),
    );

    if (newLevel.isHigherThan(previousLevel)) {
      this.addDomainEvent(
        new MemberReputationLevelUpgraded({
          memberId: this.id,
          newLevel: newLevel.value,
        }),
      );
    }
  }

  public reputationLevelAtLeast(
    level: ReputationLevel,
  ): Result<void, InsufficientMemberLevelError> {
    if (!this.props.reputationLevel.isAtLeast(level)) {
      return fail(new InsufficientMemberLevelError(level));
    }

    return success(undefined);
  }
}
