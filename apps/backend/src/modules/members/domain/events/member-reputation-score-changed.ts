import { DomainEvent } from '@forumate/core';

import { ReputationLevel } from '../value-objects';

type MemberReputationChangedData = {
  memberId: string;
  score: number;
  level: ReputationLevel;
  previousLevel: ReputationLevel;
};

export class MemberReputationChanged extends DomainEvent<MemberReputationChangedData> {
  static readonly eventName = 'MemberReputationChanged';

  constructor(data: MemberReputationChangedData) {
    super(MemberReputationChanged.eventName, data.memberId, data);
  }
}
