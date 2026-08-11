import { Member } from '../../../../members/domain/member';
import {} from '@forumate/api/members';

export class CanVoteOnPostPolicy {
  public static isAllowed(member: Member): boolean {
    // implement
    throw new Error('Not yet implemented');
  }
}
