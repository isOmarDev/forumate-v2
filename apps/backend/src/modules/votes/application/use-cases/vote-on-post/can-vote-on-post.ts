import {} from '@forumate/api/members';

import { Member } from '../../../../members/domain/member';

export class CanVoteOnPostPolicy {
  public static isAllowed(member: Member): boolean {
    // implement
    throw new Error('Not yet implemented');
  }
}
