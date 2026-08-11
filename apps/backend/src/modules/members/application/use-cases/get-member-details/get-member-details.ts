import { MembersRepository } from '../../../repos/ports/members-repository';
import { Member } from '../../../domain/member';
import { Result, UseCase } from '@forumate/core';
import { NotFoundError } from '@forumate/errors/application';

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
