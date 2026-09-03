import { Result, type IUseCase } from '@forumate/core';
import { NotFoundError } from '@forumate/errors/application';

import { Member } from '../../../domain/entities/member';
import { type IMembersRepository } from '../../../repos/ports/members-repository';

export type GetMemberDetailsError = NotFoundError;

export class GetMemberDetails implements IUseCase<
  string,
  Result<Member, GetMemberDetailsError>
> {
  constructor(private memberRepository: IMembersRepository) {}

  async execute(
    userId: string,
  ): Promise<Result<Member, GetMemberDetailsError>> {
    throw new Error('Implement');
    // Implement
  }
}
