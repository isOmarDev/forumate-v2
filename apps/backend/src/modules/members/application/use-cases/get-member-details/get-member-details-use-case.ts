import { Result, type IUseCase } from '@forumate/core';
import { NotFoundError } from '@forumate/errors/application';

import { Member } from '../../../domain/entities/member';
import type { IMembersRepository } from '../../ports/members-repository';

export type GetMemberDetailsResponse = Result<Member, NotFoundError>;

export class GetMemberDetailsUseCase implements IUseCase<
  string,
  GetMemberDetailsResponse
> {
  constructor(private memberRepository: IMembersRepository) {}

  async execute(userId: string): Promise<GetMemberDetailsResponse> {
    throw new Error('Implement');
    // Implement
  }
}
