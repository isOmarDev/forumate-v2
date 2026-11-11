import {
  CreateMemberCommand,
  UpdateMemberReputationCommand,
} from '@forumate/api';
import { IEventBus } from '@forumate/bus';

import type { IMembersRepository } from './ports/members-repository';
import { CreateMemberUseCase, GetMemberDetailsUseCase } from './use-cases';
import { UpdateMemberReputationUseCase } from './use-cases/update-member-reputation/update-member-reputation-use-case';

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

  public UpdateMemberReputation(command: UpdateMemberReputationCommand) {
    return new UpdateMemberReputationUseCase(
      this.membersRepository,
      this.eventBus,
    ).execute(command);
  }
}
