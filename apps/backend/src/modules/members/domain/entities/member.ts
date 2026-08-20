import { randomUUID } from 'node:crypto';

import { MemberDTO, ReputationLevel } from '@forumate/api';
import { AggregateRoot, fail, Result, success } from '@forumate/core';
import { Member as MemberModel } from '@forumate/database';
import { ValidationError } from '@forumate/errors/application';

import { MemberReputationLevelUpgraded } from '../events/member-reputation-level-upgraded';
import { MemberUsername } from '../value-objects/member-username';

interface MemberProps {
  id: string;
  userId: string;
  username: MemberUsername;
  reputationScore: number;
  reputationLevel: ReputationLevel;
}

export enum MemberReputationLevel {
  Level1 = 'Level 1',
  Level2 = 'Level 2',
  Level3 = 'Level 3',
}

interface CreateMemberInput {
  userId: string;
  username: string;
}

export class Member extends AggregateRoot {
  public static REPUTATION_SCORE_THRESH = {
    Level1: 5,
    Level2: 10,
  };

  private props: MemberProps;

  private constructor(props: MemberProps) {
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
    const memberUsernameOrError = MemberUsername.create(inputProps.username);

    // Example of using value objects to validate input to create the aggregate
    if (memberUsernameOrError instanceof ValidationError) {
      return fail(memberUsernameOrError);
    }

    return success(
      new Member({
        ...inputProps,
        id: randomUUID(),
        reputationScore: 0,
        reputationLevel: ReputationLevel.Level1,
        username: memberUsernameOrError,
      }),
    );
  }

  public static toDomain(recreationProps: MemberModel | MemberProps): Member {
    return new Member({
      id: recreationProps.id,
      reputationScore: recreationProps.reputationScore,
      userId: recreationProps.userId,
      username:
        recreationProps.username instanceof MemberUsername
          ? recreationProps.username
          : MemberUsername.toDomain(recreationProps.username),
      reputationLevel: recreationProps.reputationLevel as ReputationLevel,
    });
  }

  toDTO(): MemberDTO {
    return {
      userId: this.props.userId,
      memberId: this.id,
      username: this.props.username.value,
      reputationLevel: this.props.reputationLevel,
      reputationScore: this.props.reputationScore,
    };
  }

  toPersistence() {
    return {
      id: this.id,
      userId: this.props.userId,
      username: this.props.username.value,
      reputationScore: this.props.reputationScore,
      reputationLevel: this.props.reputationLevel,
    };
  }
}
