import { CreateMemberCommand } from '@forumate/api/members';
import { EventBus } from '@forumate/bus';
import { fail,Result, success, UseCase } from '@forumate/core';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@forumate/errors/application';

import { Member } from '../../../domain/member';
import { MembersRepository } from '../../../repos/ports/members-repository';

export type CreateMemberError = ValidationError | NotFoundError | ConflictError;

export class CreateMember implements UseCase<
  CreateMemberCommand,
  Result<Member, CreateMemberError>
> {
  constructor(
    private memberRepository: MembersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: CreateMemberCommand,
  ): Promise<Result<Member, CreateMemberError>> {
    // Implement
    throw new Error('Not yet implemented');
  }
}
