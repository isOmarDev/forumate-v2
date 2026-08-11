import { MembersRepository } from '../repos/ports/members-repository';
import {
  CreateMember,
  CreateMemberError,
} from './use-cases/create-member/create-member';
import {
  GetMemberDetails,
  GetMemberDetailsError,
} from './use-cases/get-member-details/get-member-details';
import { Member } from '../domain/member';
import { CreateMemberCommand } from '@forumate/api';
import { Result } from '@forumate/core';
import { EventBus } from '@forumate/bus';

export class MemberService {
  constructor(
    private membersRepository: MembersRepository,
    private eventBus: EventBus,
  ) {}

  public createMember(
    command: CreateMemberCommand,
  ): Promise<Result<Member, CreateMemberError>> {
    return new CreateMember(this.membersRepository, this.eventBus).execute(
      command,
    );
  }

  public getMemberDetails(
    userId: string,
  ): Promise<Result<Member, GetMemberDetailsError>> {
    return new GetMemberDetails(this.membersRepository).execute(userId);
  }
}
