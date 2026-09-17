// Fixtures (hvut fixtures)

import { ReputationLevel } from '@forumate/api';

import { PostCommentUseCase } from '../../../src/modules/comments/application/use-cases/post-comment/post-comment-use-case';
import { Member } from '../../../src/modules/members/domain/entities/member';
import { MemberUsername } from '../../../src/modules/members/domain/value-objects/member-username';
import { CreatePostUseCase } from '../../../src/modules/posts/application/use-cases/create-post/create-post-use-case';

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
    reputationLevel: ReputationLevel.Level2,
  });

  useCase['memberRepository'].getMemberById = jest
    .fn()
    .mockResolvedValue(level2Member);

  return level2Member;
}
