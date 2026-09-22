import { ReputationLevel } from '@forumate/api';
import { DomainEvent } from '@forumate/core';

type MemberReputationLevelUpgradedData = {
  memberId: string;
  newLevel: ReputationLevel;
};

export class MemberReputationLevelUpgraded extends DomainEvent<MemberReputationLevelUpgradedData> {
  static readonly eventName = 'MemberReputationLevelUpgraded';

  constructor(memberId: string, newLevel: ReputationLevel) {
    super(MemberReputationLevelUpgraded.eventName, memberId, {
      memberId,
      newLevel,
    });
  }
}
