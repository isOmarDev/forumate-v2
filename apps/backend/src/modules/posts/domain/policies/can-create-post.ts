import { Member } from '../../../members/domain/entities/member';

export class CanCreatePostPolicy {
  private static readonly REQUIRED_LEVEL_VALUE = 2;

  public static isAllowed(member: Member): boolean {
    return member.hasReputationLevelAtLeast(
      CanCreatePostPolicy.REQUIRED_LEVEL_VALUE,
    );
  }
}
