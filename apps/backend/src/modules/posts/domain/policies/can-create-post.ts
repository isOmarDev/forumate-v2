import { Types } from '@forumate/api';

import { Member } from '../../../members/domain/entities/member';

export class CanCreatePostPolicy {
  public static isAllowed(member: Member): boolean {
    // Implement!
    throw new Error('To be implemented');
  }
}
