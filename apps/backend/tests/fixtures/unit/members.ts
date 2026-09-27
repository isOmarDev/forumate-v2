// Fixtures (hvut fixtures)

import { PostCommentUseCase } from '../../../src/modules/comments/application/use-cases/post-comment/post-comment-use-case';
import { Member } from '../../../src/modules/members/domain/entities/member';
import {
  MemberReputationLevel,
  ReputationLevel,
} from '../../../src/modules/members/domain/value-objects/member-reputation-level';
import { MemberUsername } from '../../../src/modules/members/domain/value-objects/member-username';
import { InMemoryMembersRepository } from '../../../src/modules/members/infrastructure/repositories/in-memory-members-repository';
import { CreatePostUseCase } from '../../../src/modules/posts/application/use-cases/create-post/create-post-use-case';
import { CreateMemberInputBuilder } from '../../builders/inputs/member-input-builders';

export function setupTestWithLevel1Member(
  useCase: CreatePostUseCase | PostCommentUseCase,
) {
  const level1MemberOrError = Member.create({
    userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
    username: MemberUsername.create('jill1234').getValue(),
  });

  expect(level1MemberOrError.isSuccess).toBe(true);

  const member = level1MemberOrError.getValue();
  useCase['membersRepository'].getMemberById = jest
    .fn()
    .mockResolvedValue(member);

  return member;
}

export function setupTestWithLevel2Member(
  useCase: CreatePostUseCase | PostCommentUseCase,
) {
  jest.resetAllMocks();

  const level2Member = Member.reconstitute({
    id: 'bf6b4773-feea-44cd-a951-f0ffd68625ea',
    userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
    username: MemberUsername.create('jill-12345').getValue(),
    reputationScore: 10,
    reputationLevel: MemberReputationLevel.create(
      ReputationLevel.Level2,
    ).getValue(),
  });

  useCase['membersRepository'].getMemberById = jest
    .fn()
    .mockResolvedValue(level2Member);

  return level2Member;
}

export function setupLevel1Member(repositorySpy: InMemoryMembersRepository) {
  const memberInput = new CreateMemberInputBuilder().build();

  const username = MemberUsername.create(memberInput.username).getValue();

  const memberOrError = Member.create({
    userId: memberInput.userId,
    username,
  });

  expect(memberOrError.isSuccess).toBe(true);

  const member = memberOrError.getValue();

  repositorySpy.seed(member);

  return member;
}
