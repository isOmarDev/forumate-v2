import { UpdateMemberReputationCommand } from '@forumate/api/members';
import { type IEventBus } from '@forumate/bus';
import { Result, success, fail, type IUseCase } from '@forumate/core';

import { Member } from '../../../domain/entities/member';
import { MemberNotFoundError } from '../../../domain/errors/member-errors';
import type { IMembersRepository } from '../../ports/members-repository';

type UpdateMemberReputationError = MemberNotFoundError;
type UpdateMemberReputationResponse = Result<
  Member,
  UpdateMemberReputationError
>;

// Note: This is also something which could be done on a cron job
// We could have a cron job that runs every 24 hours and updates the reputation score of all members using
// the read models. This would be a good way to ensure that the reputation score is always up to date.

export class UpdateMemberReputationUseCase implements IUseCase<
  UpdateMemberReputationCommand,
  UpdateMemberReputationResponse
> {
  constructor(
    private membersRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(
    command: UpdateMemberReputationCommand,
  ): Promise<UpdateMemberReputationResponse> {
    const { memberId, scoreChange } = command.props;

    const member = await this.membersRepository.findById(memberId);
    if (!member) {
      return fail(new MemberNotFoundError());
    }

    member.updateReputation(scoreChange);

    await this.membersRepository.save(member);
    await this.eventBus.publishEvents(member.getDomainEvents());

    return success(member);
  }
}
