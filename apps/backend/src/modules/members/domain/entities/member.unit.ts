import { ReputationLevel } from '@forumate/api';

import { MemberUsername } from '../value-objects/member-username';

import { Member } from './member';

describe('member', () => {
  test('a new member should start out at level 1 reputation level', () => {
    const result = Member.create({
      userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
      username: MemberUsername.create('billy').getValue(),
    });

    expect(result.isSuccess).toBe(true);
    const member = result.getValue();
    expect(member.reputationLevel).toEqual(ReputationLevel.Level1);
  });
});
