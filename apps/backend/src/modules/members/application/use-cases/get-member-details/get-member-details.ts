import { Result, UseCase } from '@forumate/core';
import { NotFoundError } from '@forumate/errors/application';

import { Member } from '../../../domain/entities/member';
import { MembersRepository } from '../../../repos/ports/members-repository';

export type GetMemberDetailsError = NotFoundError;

export class GetMemberDetails implements UseCase<
  string,
  Result<Member, GetMemberDetailsError>
> {
  constructor(private memberRepository: MembersRepository) {}

  async execute(
    userId: string,
  ): Promise<Result<Member, GetMemberDetailsError>> {
    throw new Error('Implement');
    // Implement
  }
}
