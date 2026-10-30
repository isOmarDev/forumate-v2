import {
  UpdateMemberReputationScoreCommand,
  VoteOnCommentCommand,
  VoteOnPostCommand,
} from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';

import type { ICommentsRepository } from '../../comments/application/ports/comments-repository';
import type { IMembersRepository } from '../../members/application/ports/members-repository';
import type { IPostsRepository } from '../../posts/application/ports/posts-repository';

import type {
  ICommentVotesReadRepository,
  ICommentVotesRepository,
  IPostVotesReadRepository,
  IPostVotesRepository,
} from './ports';
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
    private postVotesRepository: IPostVotesRepository,
    private commentVotesRepository: ICommentVotesRepository,
    private postVotesReadRepository: IPostVotesReadRepository,
    private commentVotesReadRepository: ICommentVotesReadRepository,
    private eventBus: IEventBus,
  ) {}

  public voteOnPost(command: VoteOnPostCommand) {
    return new VoteOnPostUseCase(
      this.membersRepository,
      this.postsRepository,
      this.postVotesRepository,
      this.eventBus,
    ).execute(command);
  }

  public voteOnComment(command: VoteOnCommentCommand) {
    return new VoteOnCommentUseCase(
      this.commentVotesRepository,
      this.membersRepository,
      this.commentsRepository,
      this.eventBus,
    ).execute(command);
  }

  public updateMemberReputationScore(
    command: UpdateMemberReputationScoreCommand,
  ) {
    return new UpdateMemberReputationScoreUseCase(
      this.membersRepository,
      this.postVotesReadRepository,
      this.commentVotesReadRepository,
      this.eventBus,
    ).execute(command);
  }
}
