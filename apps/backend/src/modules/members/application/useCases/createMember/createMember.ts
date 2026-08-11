import { MembersRepository } from '../../../repos/ports/membersRepository';
import { Member } from '../../../domain/member';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@forumate/errors/application';
import { Result, UseCase, success, fail } from '@forumate/core';
import { CreateMemberCommand } from '@forumate/api/members';
import { EventBus } from '@forumate/bus';

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
