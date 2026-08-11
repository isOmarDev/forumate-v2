import { MembersRepository } from '../../../../members/repos/ports/membersRepository';

import { PostVote } from '../../../domain/postVote';
import { CanVoteOnPostPolicy } from './canVoteOnPost';
import { PostsRepository } from '../../../../posts/repos/ports/postsRepository';
import { VoteRepository } from '../../../repos/ports/voteRepository';
import { VoteOnPostCommand } from '@forumate/api/votes';
import { EventBus } from '@forumate/bus';
import {
  NotFoundError,
  PermissionError,
  ValidationError,
} from '@forumate/errors/application';
import { DatabaseError } from '@forumate/errors/server';
import { Result, success, UseCase } from '@forumate/core';

type VoteOnPostError =
  ValidationError | PermissionError | NotFoundError | DatabaseError;

export class VoteOnPost implements UseCase<
  VoteOnPostCommand,
  Result<PostVote, VoteOnPostError>
> {
  constructor(
    private memberRepository: MembersRepository,
    private postRepository: PostsRepository,
    private voteRepository: VoteRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: VoteOnPostCommand,
  ): Promise<Result<PostVote, VoteOnPostError>> {
    // implement
    throw new Error('Not yet implemented');
  }
}
