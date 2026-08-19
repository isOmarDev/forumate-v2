import { randomUUID } from 'node:crypto';

import { ReputationLevel } from '@forumate/api';
import { DomainEvent } from '@forumate/core';

export class MemberReputationLevelUpgraded extends DomainEvent {
  constructor(
    public readonly memberId: string,
    public readonly newLevel: ReputationLevel,
    public readonly id: string = randomUUID(),
    public readonly date: Date = new Date(),
  ) {
    super(id, date, 'MemberReputationLevelUpgraded');
  }
}
