import { Types } from '@forumate/api';

import { Member } from '../../../../members/domain/member';

export class CanCreatePostPolicy {
  public static isAllowed(member: Member): boolean {
    // Implement!
    throw new Error('To be implemented');
  }
}
