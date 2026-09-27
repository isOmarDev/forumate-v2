import { IToDomainMapper } from '@forumate/core/application';

import {
  MemberReputationLevel,
  ReputationLevel,
} from '../../domain/value-objects/member-reputation-level';
import { MemberUsername } from '../../domain/value-objects/member-username';

class MemberReputationLevelMapper implements IToDomainMapper<
  string,
  MemberUsername
> {
  toDomain(persistence: ReputationLevel): MemberReputationLevel {
    return MemberReputationLevel.reconstitute(persistence);
  }
}

export const MemberReputationLevelMap = new MemberReputationLevelMapper();
