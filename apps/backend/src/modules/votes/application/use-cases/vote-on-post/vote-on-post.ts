import { VoteOnPostCommand } from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';
import { Result, success, type IUseCase } from '@forumate/core';
import { NotFoundError, ValidationError } from '@forumate/errors/application';
import { DatabaseError } from '@forumate/errors/server';

import { type IMembersRepository } from '../../../../members/repos/ports/members-repository';
import { type IPostsRepository } from '../../../../posts/repos/ports/posts-repository';
import { PostVote } from '../../../domain/entities/post-vote';
import { CanVoteOnPostPolicy } from '../../../domain/policies/can-vote-on-post';
import { type IVoteRepository } from '../../../repos/ports/vote-repository';

type VoteOnPostError = ValidationError | NotFoundError | DatabaseError;

export class VoteOnPost implements IUseCase<
  VoteOnPostCommand,
  Result<PostVote, VoteOnPostError>
> {
  constructor(
    private memberRepository: IMembersRepository,
    private postRepository: IPostsRepository,
    private voteRepository: IVoteRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(
    request: VoteOnPostCommand,
  ): Promise<Result<PostVote, VoteOnPostError>> {
    // implement
    throw new Error('Not yet implemented');
  }
}
