import { Result, success } from '@forumate/core/application';

import { Member } from '../../../members/domain/entities/member';
import { InsufficientMemberLevelError } from '../../../members/domain/errors/member-errors';
import { reputationLevel } from '../../../members/domain/value-objects';
import { Post } from '../../../posts/domain/entities/post';

export class CanVoteOnPostPolicy {
  private static readonly REQUIRED_LEVEL_VALUE = reputationLevel.level2;

  public static check(
    member: Member,
    post: Post,
  ): Result<void, InsufficientMemberLevelError> {
    if (post.isAuthoredBy(member.id)) {
      return success(undefined);
    }

    return member.reputationLevelAtLeast(
      CanVoteOnPostPolicy.REQUIRED_LEVEL_VALUE,
    );
  }
}
