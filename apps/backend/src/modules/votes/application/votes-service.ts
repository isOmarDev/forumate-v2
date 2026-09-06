import {
  UpdateMemberReputationScoreCommand,
  VoteOnCommentCommand,
  VoteOnPostCommand,
} from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';

import type { ICommentsRepository } from '../../comments/application/ports/comments-repository';
import type { IMembersRepository } from '../../members/application/ports/members-repository';
import type { IPostsRepository } from '../../posts/application/ports/posts-repository';

import type { IVotesRepository } from './ports/votes-repository';
import {
  UpdateMemberReputationScoreUseCase,
  VoteOnCommentUseCase,
  VoteOnPostUseCase,
} from './use-cases';

export class VotesService {
  constructor(
    private memberRepository: IMembersRepository,
    private commentsRepository: ICommentsRepository,
    private postRepository: IPostsRepository,
    private voteRepository: IVotesRepository,
    private eventBus: IEventBus,
  ) {}

  castVoteOnPost(command: VoteOnPostCommand) {
    return new VoteOnPostUseCase(
      this.memberRepository,
      this.postRepository,
      this.voteRepository,
      this.eventBus,
    ).execute(command);
  }

  castVoteOnComment(command: VoteOnCommentCommand) {
    return new VoteOnCommentUseCase(
      this.memberRepository,
      this.commentsRepository,
      this.voteRepository,
      this.eventBus,
    ).execute(command);
  }

  updateMemberReputationScore(command: UpdateMemberReputationScoreCommand) {
    return new UpdateMemberReputationScoreUseCase(
      this.memberRepository,
      this.voteRepository,
      this.eventBus,
    ).execute(command);
  }
}
