import { Result } from '@forumate/core/application';

import { Member } from '../../../members/domain/entities/member';
import { InsufficientMemberLevelError } from '../../../members/domain/errors/member-errors';
import { reputationLevel } from '../../../members/domain/value-objects/member-reputation-level';

export class CanPostCommentPolicy {
  private static readonly REQUIRED_LEVEL_VALUE = reputationLevel.level1;

  public static check(
    member: Member,
  ): Result<void, InsufficientMemberLevelError> {
    return member.reputationLevelAtLeast(
      CanPostCommentPolicy.REQUIRED_LEVEL_VALUE,
    );
  }
}
