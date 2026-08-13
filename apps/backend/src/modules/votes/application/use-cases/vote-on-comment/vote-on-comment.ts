import { VoteOnCommentCommand } from '@forumate/api/votes';
import { EventBus } from '@forumate/bus';
import { fail,Result, success, UseCase } from '@forumate/core';
import {
  NotFoundError,
  PermissionError,
  ValidationError,
} from '@forumate/errors/application';
import { DatabaseError } from '@forumate/errors/server';

import { CommentRepository } from '../../../../comments/repos/ports/comment-repository';
import { MembersRepository } from '../../../../members/repos/ports/members-repository';
import { CommentVote } from '../../../domain/comment-vote';
import { VoteRepository } from '../../../repos/ports/vote-repository';

import { CanVoteOnCommentPolicy } from './can-vote-on-comment';

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
