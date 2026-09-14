import { randomUUID } from 'node:crypto';

import { ReputationLevel } from '@forumate/api/members';
import { AggregateRoot, Result, success } from '@forumate/core';
import { ValidationError } from '@forumate/errors/application';

import { MemberReputationLevelUpgraded } from '../events/member-reputation-level-upgraded';
import { MemberUsername } from '../value-objects/member-username';

interface CreateMemberInput {
  userId: string;
  username: MemberUsername;
}

interface ReconstituteMemberInput {
  id: string;
  userId: string;
  username: MemberUsername;
  reputationScore: number;
  reputationLevel: ReputationLevel;
}

interface MemberProps {
  id: string;
  userId: string;
  username: MemberUsername;
  reputationScore: number;
  reputationLevel: ReputationLevel;
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
    return this.props.username;
  }

  get reputationLevel() {
    return this.props.reputationLevel;
  }

  updateReputationScore(newScore: number) {
    const oldScore = this.props.reputationScore;
    this.props.reputationScore = newScore;

    console.log('score', newScore);
    if (
      oldScore < Member.REPUTATION_SCORE_THRESH.Level1 &&
      newScore >= Member.REPUTATION_SCORE_THRESH.Level1
    ) {
      this.props.reputationLevel = ReputationLevel.Level2;
      this.domainEvents.push(
        new MemberReputationLevelUpgraded(this.id, this.reputationLevel),
      );
      console.log('going to level 2!');
    } else if (
      oldScore < Member.REPUTATION_SCORE_THRESH.Level2 &&
      newScore >= Member.REPUTATION_SCORE_THRESH.Level2
    ) {
      this.props.reputationLevel = ReputationLevel.Level3;
      console.log('going to level 3!');
      this.domainEvents.push(
        new MemberReputationLevelUpgraded(this.id, this.reputationLevel),
      );
    }
  }

  public static create(
    inputProps: CreateMemberInput,
  ): Result<Member, ValidationError> {
    return success(
      new Member({
        ...inputProps,
        id: randomUUID(),
        reputationScore: 0,
        reputationLevel: ReputationLevel.Level1,
      }),
    );
  }

  public static reconstitute(input: ReconstituteMemberInput): Member {
    return new Member({
      id: input.id,
      userId: input.userId,
      username: input.username,
      reputationScore: input.reputationScore,
      reputationLevel: input.reputationLevel,
    });
  }
}
