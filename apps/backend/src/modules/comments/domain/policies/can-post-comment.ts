import { Member } from '../../../members/domain/entities/member';

export class CanPostCommentPolicy {
  public static isAllowed(member: Member): boolean {
    // Implement
    throw new Error('Not yet implemented');
  }
}
