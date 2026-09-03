import { CreateMemberCommand } from '@forumate/api';
import { IEventBus } from '@forumate/bus';
import { Result } from '@forumate/core';

import { Member } from '../domain/entities/member';
import { IMembersRepository } from '../repos/ports/members-repository';

import {
  CreateMember,
  CreateMemberError,
} from './use-cases/create-member/create-member';
import {
  GetMemberDetails,
  GetMemberDetailsError,
} from './use-cases/get-member-details/get-member-details';

export class MembersService {
  constructor(
    private membersRepository: IMembersRepository,
    private eventBus: IEventBus,
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
