import { DomainEvent } from '@forumate/core';

import { ReputationLevel } from '../value-objects';

type MemberReputationLevelUpgradedData = {
  memberId: string;
  newLevel: ReputationLevel;
};

export class MemberReputationLevelUpgraded extends DomainEvent<MemberReputationLevelUpgradedData> {
  static readonly eventName = 'MemberReputationLevelUpgraded';

  constructor(data: MemberReputationLevelUpgradedData) {
    super(MemberReputationLevelUpgraded.eventName, data.memberId, data);
  }
}
