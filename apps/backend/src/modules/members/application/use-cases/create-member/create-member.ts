import { CreateMemberCommand } from '@forumate/api/members';
import { type IEventBus } from '@forumate/bus';
import { type IUseCase, Result, fail, success } from '@forumate/core';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@forumate/errors/application';

import { Member } from '../../../domain/entities/member';
import { type IMembersRepository } from '../../../repos/ports/members-repository';

export type CreateMemberError = ValidationError | NotFoundError | ConflictError;

export class CreateMember implements IUseCase<
  CreateMemberCommand,
  Result<Member, CreateMemberError>
> {
  constructor(
    private memberRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(
    request: CreateMemberCommand,
  ): Promise<Result<Member, CreateMemberError>> {
    // Implement
    throw new Error('Not yet implemented');
  }
}
