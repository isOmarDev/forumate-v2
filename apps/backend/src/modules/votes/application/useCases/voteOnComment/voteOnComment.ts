import { MembersRepository } from '../../../../members/repos/ports/membersRepository';
import { VoteRepository } from '../../../repos/ports/voteRepository';
import { CommentVote } from '../../../domain/commentVote';
import { CanVoteOnCommentPolicy } from './canVoteOnComment';
import { CommentRepository } from '../../../../comments/repos/ports/commentRepository';
import {
  NotFoundError,
  PermissionError,
  ValidationError,
} from '@forumate/errors/application';
import { DatabaseError } from '@forumate/errors/server';
import { UseCase, Result, success, fail } from '@forumate/core';
import { VoteOnCommentCommand } from '@forumate/api/votes';
import { EventBus } from '@forumate/bus';

type VoteOnCommentError =
  ValidationError | PermissionError | NotFoundError | DatabaseError;

export class VoteOnComment implements UseCase<
  VoteOnCommentCommand,
  Result<CommentVote, VoteOnCommentError>
> {
  constructor(
    private memberRepository: MembersRepository,
    private commentRepo: CommentRepository,
    private voteRepository: VoteRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: VoteOnCommentCommand,
  ): Promise<Result<CommentVote, VoteOnCommentError>> {
    // implement
    throw new Error('Not yet implemented');
  }
}
