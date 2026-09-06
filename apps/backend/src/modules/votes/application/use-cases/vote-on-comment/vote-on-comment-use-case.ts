import { VoteOnCommentCommand } from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';
import { Result, fail, success, type IUseCase } from '@forumate/core';
import { NotFoundError, ValidationError } from '@forumate/errors/application';
import { DatabaseError } from '@forumate/errors/server';

import { type ICommentsRepository } from '../../../../comments/application/ports/comments-repository';
import { type IMembersRepository } from '../../../../members/application/ports/members-repository';
import { CommentVote } from '../../../domain/entities/comment-vote';
import { CanVoteOnCommentPolicy } from '../../../domain/policies/can-vote-on-comment';
import type { IVotesRepository } from '../../ports/votes-repository';

export type VoteOnCommentError =
  ValidationError | NotFoundError | DatabaseError;
export type VoteOnCommentResponse = Result<CommentVote, VoteOnCommentError>;

export class VoteOnCommentUseCase implements IUseCase<
  VoteOnCommentCommand,
  VoteOnCommentResponse
> {
  constructor(
    private memberRepository: IMembersRepository,
    private commentRepo: ICommentsRepository,
    private voteRepository: IVotesRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(request: VoteOnCommentCommand): Promise<VoteOnCommentResponse> {
    // implement
    throw new Error('Not yet implemented');
  }
}
