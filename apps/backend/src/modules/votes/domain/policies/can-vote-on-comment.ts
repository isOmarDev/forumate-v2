import {} from '@forumate/api/members';

import { Comment } from '../../../comments/domain/entities/comment';
import { Member } from '../../../members/domain/entities/member';

export class CanVoteOnCommentPolicy {
  public static isAllowed(member: Member, comment: Comment): boolean {
    // implement
    throw new Error('Not yet implemented');
  }
}
