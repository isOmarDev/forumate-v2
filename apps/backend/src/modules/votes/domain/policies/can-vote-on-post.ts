import { Member } from '../../../members/domain/entities/member';

export class CanVoteOnPostPolicy {
  public static isAllowed(member: Member): boolean {
    // implement
    throw new Error('Not yet implemented');
  }
}
