import { ToDomainMapper } from '@forumate/core/application';

import { MemberUsername } from '../../domain/value-objects/member-username';

class MemberUsernameMapper implements ToDomainMapper<MemberUsername, string> {
  toDomain(username: string): MemberUsername {
    const memberOrError = MemberUsername.create(username);
    return memberOrError.getValue();
  }
}
export const MemberUsernameMap = new MemberUsernameMapper();
