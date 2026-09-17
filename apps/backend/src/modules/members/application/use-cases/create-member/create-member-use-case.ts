import { CreateMemberCommand } from '@forumate/api/members';
import { type IEventBus } from '@forumate/bus';
import { type IUseCase, Result, fail, success } from '@forumate/core';

import { Member } from '../../../domain/entities/member';
import {
  InvalidMemberUsernameError,
  MemberAlreadyExistsError,
  MemberUsernameAlreadyExistsError,
} from '../../../domain/errors/member-errors';
import { MemberUsername } from '../../../domain/value-objects/member-username';
import type { IMembersRepository } from '../../ports/members-repository';

export type CreateMemberError =
  | InvalidMemberUsernameError
  | MemberAlreadyExistsError
  | MemberUsernameAlreadyExistsError;
export type CreateMemberResponse = Result<Member, CreateMemberError>;

export class CreateMemberUseCase implements IUseCase<
  CreateMemberCommand,
  CreateMemberResponse
> {
  constructor(
    private membersRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(command: CreateMemberCommand): Promise<CreateMemberResponse> {
    const { username, userId } = command.props;

    const usernameOrError = MemberUsername.create(username);
    if (usernameOrError.isFailure) {
      return fail(usernameOrError.getError());
    }

    const existingMemberByUserId =
      await this.membersRepository.getByUserId(userId);
    if (existingMemberByUserId) {
      return fail(new MemberAlreadyExistsError());
    }

    const existingMemberByUsername =
      await this.membersRepository.getByUsername(username);
    if (existingMemberByUsername) {
      return fail(new MemberUsernameAlreadyExistsError());
    }

    const memberOrError = Member.create({
      username: usernameOrError.getValue(),
      userId,
    });

    if (memberOrError.isFailure) {
      return fail(memberOrError.getError());
    }

    const member = memberOrError.getValue();

    await this.membersRepository.save(member);
    this.eventBus.publishEvents(member.getDomainEvents());

    return success(member);
  }
}
