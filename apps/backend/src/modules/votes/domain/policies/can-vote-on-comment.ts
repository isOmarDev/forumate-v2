import { Result, success } from '@forumate/core/application';

import { Comment } from '../../../comments/domain/entities/comment';
import { Member } from '../../../members/domain/entities/member';
import { InsufficientMemberLevelError } from '../../../members/domain/errors/member-errors';
import { ReputationLevel } from '../../../members/domain/value-objects/member-reputation-level';

export class CanVoteOnCommentPolicy {
  private static readonly REQUIRED_LEVEL_VALUE = ReputationLevel.Level2;

  public static check(
    member: Member,
    comment: Comment,
  ): Result<void, InsufficientMemberLevelError> {
    if (comment.isAuthoredBy(member.id)) {
      return success(undefined);
    }

    return member.reputationLevelAtLeast(
      CanVoteOnCommentPolicy.REQUIRED_LEVEL_VALUE,
    );
  }
}
