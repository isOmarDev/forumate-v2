import { Member } from '../../../src/modules/members/domain/entities/member';
import {
  MemberUsername,
  MemberReputationLevel,
  ReputationLevel,
} from '../../../src/modules/members/domain/value-objects';
import { InMemoryMembersRepository } from '../../../src/modules/members/infrastructure/repositories/in-memory-members-repository';
import { CreateMemberInputBuilder } from '../../builders/inputs/member-input-builders';

export function setupLevel1Member(repositorySpy: InMemoryMembersRepository) {
  const memberInput = new CreateMemberInputBuilder().build();

  const memberOrError = Member.create({
    userId: memberInput.userId,
    username: MemberUsername.create(memberInput.username).getValue(),
  });

  const member = memberOrError.getValue();

  repositorySpy.seed(member);

  return member;
}

export function setupLevel2Member(repositorySpy: InMemoryMembersRepository) {
  const member = Member.reconstitute({
    id: 'bf6b4773-feea-44cd-a951-f0ffd68625ea',
    userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
    username: MemberUsername.create('jill-12345').getValue(),
    reputationScore: 10,
    reputationLevel: MemberReputationLevel.create(
      ReputationLevel.Level2,
    ).getValue(),
  });

  repositorySpy.seed(member);

  return member;
}
