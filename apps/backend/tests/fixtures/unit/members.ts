import { randomUUID } from 'node:crypto';

import { Member } from '../../../src/modules/members/domain/entities/member';
import {
  MemberUsername,
  MemberReputationLevel,
  reputationLevel,
} from '../../../src/modules/members/domain/value-objects';
import { InMemoryMembersRepository } from '../../../src/modules/members/infrastructure/repositories/in-memory';
import { CreateMemberInputBuilder } from '../../builders/inputs/member-input-builders';

export function setupLevel1Member(repositorySpy: InMemoryMembersRepository) {
  const input = new CreateMemberInputBuilder().build();

  const memberOrError = Member.create({
    userId: input.userId,
    username: MemberUsername.create(input.username).getValue(),
  });

  const member = memberOrError.getValue();

  repositorySpy.seed(member);

  return member;
}

export function setupLevel2Member(repositorySpy: InMemoryMembersRepository) {
  const input = new CreateMemberInputBuilder().build();

  const member = Member.reconstitute({
    id: randomUUID(),
    userId: randomUUID(),
    username: MemberUsername.create(input.username).getValue(),
    reputationScore: 5,
    reputationLevel: MemberReputationLevel.create(
      reputationLevel.level2,
    ).getValue(),
  });

  repositorySpy.seed(member);

  return member;
}
