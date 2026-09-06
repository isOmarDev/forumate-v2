import { randomUUID } from 'node:crypto';

import { ReputationLevel } from '@forumate/api/members';
import { UpdateMemberReputationScoreCommand } from '@forumate/api/votes';
import { InMemoryEventBus } from '@forumate/bus';
import { PrismaDatabase } from '@forumate/database';

import { Config } from '../../../../../shared/config';
import { Member } from '../../../../members/domain/entities/member';
import { MemberUsername } from '../../../../members/domain/value-objects/member-username';
import { PrismaMembersRepository } from '../../../../members/infrastructure/repositories/prisma-members-repository';
import { prismaVotesRepository } from '../../../infrastructure/repositories/prisma-votes-repo';
import { MemberCommentVotesRoundup } from '../../read-models/member-comment-votes-roundup';
import { MemberPostVotesRoundup } from '../../read-models/member-post-votes-roundup';

import { UpdateMemberReputationScoreUseCase } from './update-member-reputation-score-use-case';

function setupTest({
  useCase,
  commentVotes,
  postVotes,
  member: { reputationLevel, reputationScore },
}: {
  useCase: UpdateMemberReputationScoreUseCase;
  commentVotes: { upvotes: number; downvotes: number; count: number };
  postVotes: { upvotes: number; downvotes: number; count: number };
  member: { reputationLevel: ReputationLevel; reputationScore: number };
}) {
  jest.resetAllMocks();

  const member = Member.toDomain({
    userId: randomUUID(),
    username: MemberUsername.toDomain('jill1234'),
    reputationScore,
    reputationLevel,
    id: randomUUID(),
  });

  const commentVotesRoundup = MemberCommentVotesRoundup.toDomain({
    allCommentsCount: commentVotes.count,
    upvotesCount: commentVotes.upvotes,
    downvotesCount: commentVotes.downvotes,
    memberId: member.id,
  });

  const postVotesRoundup = MemberPostVotesRoundup.toDomain({
    allPostsCount: postVotes.count,
    downvotesCount: postVotes.downvotes,
    upvotesCount: postVotes.upvotes,
    memberId: member.id,
  });

  useCase['memberRepository'].getMemberById = jest
    .fn()
    .mockResolvedValue(member);
  useCase['votesRepository'].getMemberPostVotesRoundup = jest
    .fn()
    .mockResolvedValue(postVotesRoundup);
  useCase['votesRepository'].getMemberCommentVotesRoundup = jest
    .fn()
    .mockResolvedValue(commentVotesRoundup);

  return { member, commentVotesRoundup, postVotesRoundup };
}

describe('updateMemberReputationScore', () => {
  const config = new Config('test:unit');
  const database = new PrismaDatabase();

  const membersRepo = new PrismaMembersRepository(database);
  const votesRepo = new prismaVotesRepository(database);
  const eventBus = new InMemoryEventBus();

  const useCase = new UpdateMemberReputationScoreUseCase(
    membersRepo,
    votesRepo,
    eventBus,
  );

  describe('update with reputation level upgrade', () => {
    test(`
      given a level 1 member has an existing reputation score of 0,
      and they have posted 6 comments,
      when we update the member reputation score
      then the member should have a reputation score of 6`, async () => {
      const { member } = setupTest({
        useCase,
        commentVotes: { upvotes: 6, downvotes: 0, count: 6 },
        postVotes: { upvotes: 0, downvotes: 0, count: 0 },
        member: {
          reputationLevel: ReputationLevel.Level1,
          reputationScore: 0,
        },
      });

      const saveSpy = jest
        .spyOn(useCase['memberRepository'], 'save')
        .mockImplementation(async () => {});

      const command = new UpdateMemberReputationScoreCommand({
        memberId: member.id,
      });

      const response = await useCase.execute(command);

      expect(response.isSuccess()).toBe(true);
      const updatedMember = response.getValue();
      expect(updatedMember.reputationScore).toBe(6);
      expect(updatedMember.reputationLevel).toBe(ReputationLevel.Level2);
      expect(updatedMember.getDomainEvents().length).toBe(1);
      expect(updatedMember.getDomainEvents()[0].name).toBe(
        'MemberReputationLevelUpgraded',
      );
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });
});
