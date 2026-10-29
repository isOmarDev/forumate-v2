import { Result } from '@forumate/core/application';

import { Member } from '../../../members/domain/entities/member';
import { InsufficientMemberLevelError } from '../../../members/domain/errors/member-errors';
import { ReputationLevel } from '../../../members/domain/value-objects/member-reputation-level';

export class CanCreatePostPolicy {
  private static readonly REQUIRED_LEVEL_VALUE = ReputationLevel.Level2;

  public static check(
    member: Member,
  ): Result<void, InsufficientMemberLevelError> {
    return member.reputationLevelAtLeast(
      CanCreatePostPolicy.REQUIRED_LEVEL_VALUE,
    );
  }
}
