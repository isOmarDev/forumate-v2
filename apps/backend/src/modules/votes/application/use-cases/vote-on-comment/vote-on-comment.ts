import { VoteOnCommentCommand } from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';
import { Result, fail, success, type IUseCase } from '@forumate/core';
import { NotFoundError, ValidationError } from '@forumate/errors/application';
import { DatabaseError } from '@forumate/errors/server';

import { type ICommentRepository } from '../../../../comments/repos/ports/comment-repository';
import { type IMembersRepository } from '../../../../members/repos/ports/members-repository';
import { CommentVote } from '../../../domain/entities/comment-vote';
import { CanVoteOnCommentPolicy } from '../../../domain/policies/can-vote-on-comment';
import { IVoteRepository } from '../../../repos/ports/vote-repository';

type VoteOnCommentError = ValidationError | NotFoundError | DatabaseError;

export class VoteOnComment implements IUseCase<
  VoteOnCommentCommand,
  Result<CommentVote, VoteOnCommentError>
> {
  constructor(
    private memberRepository: IMembersRepository,
    private commentRepo: ICommentRepository,
    private voteRepository: IVoteRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(
    request: VoteOnCommentCommand,
  ): Promise<Result<CommentVote, VoteOnCommentError>> {
    // implement
    throw new Error('Not yet implemented');
  }
}
