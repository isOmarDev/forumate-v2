import { CreateMemberCommand } from '@forumate/api';
import { IEventBus } from '@forumate/bus';
import { Result } from '@forumate/core';

import { Member } from '../domain/entities/member';

import type { IMembersRepository } from './ports/members-repository';
import { CreateMemberUseCase, GetMemberDetailsUseCase } from './use-cases';

export class MembersService {
  constructor(
    private membersRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  public createMember(command: CreateMemberCommand) {
    return new CreateMemberUseCase(
      this.membersRepository,
      this.eventBus,
    ).execute(command);
  }

  public getMemberDetails(userId: string) {
    return new GetMemberDetailsUseCase(this.membersRepository).execute(userId);
  }
}
