import { IToDomainMapper } from '@forumate/core/application';

import { MemberUsername } from '../../domain/value-objects/member-username';

class MemberUsernameMapper implements IToDomainMapper<string, MemberUsername> {
  toDomain(username: string): MemberUsername {
    return MemberUsername.reconstitute(username);
  }
}

export const MemberUsernameMap = new MemberUsernameMapper();
