import { randomUUID } from 'node:crypto';

import { AggregateRoot, Result, success } from '@forumate/core';

import { MemberReputationLevelUpgraded } from '../events/member-reputation-level-upgraded';
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
  public static REPUTATION_SCORE_THRESH = {
    Level1: 5,
    Level2: 10,
  };

  private constructor(private props: MemberProps) {
    super();
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get reputationScore() {
    return this.props.reputationScore;
  }

  get username() {
    return this.props.username.value;
  }

  get reputationLevel() {
    return this.props.reputationLevel.value;
  }

  get reputationLevelNumeric() {
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

  public updateReputationScore(newScore: number) {
    const oldScore = this.props.reputationScore;
    this.props.reputationScore = newScore;
    console.log('score', newScore);

    if (
      oldScore < Member.REPUTATION_SCORE_THRESH.Level1 &&
      newScore >= Member.REPUTATION_SCORE_THRESH.Level1
    ) {
      const reputationLevel2 = MemberReputationLevel.create(
        ReputationLevel.Level2,
      ).getValue();
      this.props.reputationLevel = reputationLevel2;

      this.domainEvents.push(
        new MemberReputationLevelUpgraded(this.id, this.reputationLevel),
      );
      console.log('going to level 2!');
    } else if (
      oldScore < Member.REPUTATION_SCORE_THRESH.Level2 &&
      newScore >= Member.REPUTATION_SCORE_THRESH.Level2
    ) {
      const reputationLevel3 = MemberReputationLevel.create(
        ReputationLevel.Level3,
      ).getValue();
      this.props.reputationLevel = reputationLevel3;
      console.log('going to level 3!');

      this.domainEvents.push(
        new MemberReputationLevelUpgraded(this.id, this.reputationLevel),
      );
    }
  }

  public hasReputationLevelAtLeast(level: number): boolean {
    return this.props.reputationLevel.isAtLeast(level);
  }
}
