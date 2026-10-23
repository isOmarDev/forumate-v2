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
    private membersRepository: IMembersRepository,
    private commentsRepository: ICommentsRepository,
    private postsRepository: IPostsRepository,
    private votesRepository: IVotesRepository,
    private eventBus: IEventBus,
  ) {}

  voteOnPost(command: VoteOnPostCommand) {
    return new VoteOnPostUseCase(
      this.membersRepository,
      this.postsRepository,
      this.votesRepository,
      this.eventBus,
    ).execute(command);
  }

  voteOnComment(command: VoteOnCommentCommand) {
    return new VoteOnCommentUseCase(
      this.membersRepository,
      this.commentsRepository,
      this.votesRepository,
      this.eventBus,
    ).execute(command);
  }

  updateMemberReputationScore(command: UpdateMemberReputationScoreCommand) {
    return new UpdateMemberReputationScoreUseCase(
      this.membersRepository,
      this.votesRepository,
      this.eventBus,
    ).execute(command);
  }
}
