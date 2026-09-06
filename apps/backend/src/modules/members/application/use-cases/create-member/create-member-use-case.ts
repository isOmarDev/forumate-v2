import { CreateMemberCommand } from '@forumate/api/members';
import { type IEventBus } from '@forumate/bus';
import { type IUseCase, Result, fail, success } from '@forumate/core';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@forumate/errors/application';

import { Member } from '../../../domain/entities/member';
import type { IMembersRepository } from '../../ports/members-repository';

export type CreateMemberError = ValidationError | NotFoundError | ConflictError;
export type CreateMemberResponse = Result<Member, CreateMemberError>;

export class CreateMemberUseCase implements IUseCase<
  CreateMemberCommand,
  CreateMemberResponse
> {
  constructor(
    private memberRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(request: CreateMemberCommand): Promise<CreateMemberResponse> {
    // Implement
    throw new Error('Not yet implemented');
  }
}
