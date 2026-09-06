import { VoteOnPostCommand } from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';
import { Result, success, type IUseCase } from '@forumate/core';
import { NotFoundError, ValidationError } from '@forumate/errors/application';
import { DatabaseError } from '@forumate/errors/server';

import type { IMembersRepository } from '../../../../members/application/ports/members-repository';
import type { IPostsRepository } from '../../../../posts/application/ports/posts-repository';
import { PostVote } from '../../../domain/entities/post-vote';
import { CanVoteOnPostPolicy } from '../../../domain/policies/can-vote-on-post';
import type { IVotesRepository } from '../../ports/votes-repository';

type VoteOnPostError = ValidationError | NotFoundError | DatabaseError;
type VoteOnPostResponse = Result<PostVote, VoteOnPostError>;

export class VoteOnPostUseCase implements IUseCase<
  VoteOnPostCommand,
  VoteOnPostResponse
> {
  constructor(
    private memberRepository: IMembersRepository,
    private postRepository: IPostsRepository,
    private voteRepository: IVotesRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(request: VoteOnPostCommand): Promise<VoteOnPostResponse> {
    // implement
    throw new Error('Not yet implemented');
  }
}
