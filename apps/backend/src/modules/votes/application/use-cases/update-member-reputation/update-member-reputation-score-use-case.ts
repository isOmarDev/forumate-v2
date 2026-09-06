import { UpdateMemberReputationScoreCommand } from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';
import { Result, type IUseCase } from '@forumate/core';
import { NotFoundError } from '@forumate/errors/application';
import { DatabaseError } from '@forumate/errors/server';

import type { IMembersRepository } from '../../../../members/application/ports/members-repository';
import { Member } from '../../../../members/domain/entities/member';
import { MemberNotFoundError } from '../../../../members/domain/errors/member-errors';
import type { IVotesRepository } from '../../ports/votes-repository';

type UpdateMemberReputationError = NotFoundError | DatabaseError;
type UpdateMemberReputationResponse = Result<
  Member,
  UpdateMemberReputationError
>;

// Note: This is also something which could be done on a cron job
// We could have a cron job that runs every 24 hours and updates the reputation score of all members using
// the read models. This would be a good way to ensure that the reputation score is always up to date.

export class UpdateMemberReputationScoreUseCase implements IUseCase<
  UpdateMemberReputationScoreCommand,
  UpdateMemberReputationResponse
> {
  constructor(
    private memberRepository: IMembersRepository,
    private votesRepository: IVotesRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(
    request: UpdateMemberReputationScoreCommand,
  ): Promise<UpdateMemberReputationResponse> {
    const { memberId } = request.props;

    const [memberOrNull, commentVotesRoundup, postVotesRoundup] =
      await Promise.all([
        this.memberRepository.getMemberById(memberId),
        this.votesRepository.getMemberCommentVotesRoundup(memberId),
        this.votesRepository.getMemberPostVotesRoundup(memberId),
      ]);

    if (memberOrNull === null) {
      return Result.failure(new MemberNotFoundError());
    }

    // Get the current score from the read models for this member to calculate
    // We calculate the score by:
    // - all comment upvotes not owned by this member (score)
    // - all post upvotes not owned by this member (score)
    const newScore =
      commentVotesRoundup.getScore() + postVotesRoundup.getScore();

    // This is another great example and reason for why we need read models.
    // More optimized queries.

    memberOrNull.updateReputationScore(newScore);

    try {
      await this.memberRepository.save(memberOrNull);
      await this.eventBus.publishEvents(memberOrNull.getDomainEvents());
      return Result.success(memberOrNull);
    } catch (err) {
      return Result.failure(new DatabaseError());
    }
  }
}
