import { Member } from '../../../members/domain/entities/member';

export class CanPostCommentPolicy {
  public static isAllowed(member: Member): boolean {
    return member.hasReputationLevelAtLeast(1);
  }
}
