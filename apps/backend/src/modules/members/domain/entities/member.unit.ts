import { randomUUID } from 'node:crypto';

import { MemberReputationLevel, reputationLevel } from '../value-objects';
import { MemberUsername } from '../value-objects/member-username';

import { Member } from './member';

describe('member', () => {
  it('should start out at level 1 reputation level as new member', () => {
    const result = Member.create({
      userId: randomUUID(),
      username: MemberUsername.create('billy').getValue(),
    });

    expect(result.isSuccess).toBe(true);

    const member = result.getValue();
    expect(member.reputationLevel.value).toBe(reputationLevel.level1);
  });

  it('should upgrade member level to 2 when reaches level 2 threshold', () => {
    const member = Member.reconstitute({
      id: randomUUID(),
      userId: randomUUID(),
      username: MemberUsername.create('omarimmik').getValue(),
      reputationScore: 4,
      reputationLevel: MemberReputationLevel.initial(),
    });

    expect(member).toBeInstanceOf(Member);

    member.updateReputation(1);

    expect(member.reputationScore).toBe(5);
    expect(member.reputationLevel.value).toBe(reputationLevel.level2);
  });

  it('should upgrade member level to 3 when reaches level 3 threshold', () => {
    const member = Member.reconstitute({
      id: randomUUID(),
      userId: randomUUID(),
      username: MemberUsername.create('omarimmik').getValue(),
      reputationScore: 9,
      reputationLevel: MemberReputationLevel.create('level2').getValue(),
    });

    expect(member).toBeInstanceOf(Member);

    member.updateReputation(1);

    expect(member.reputationScore).toBe(10);
    expect(member.reputationLevel.value).toBe(reputationLevel.level3);
  });
});
