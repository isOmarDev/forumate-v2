import {
  CastInitialUpvoteOnCommentCommand,
  VoteOnCommentCommand,
  VoteOnPostCommand,
} from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';

import type { ICommentsRepository } from '../../comments/application/ports/comments-repository';
import type { IMembersRepository } from '../../members/application/ports/members-repository';
import type { IPostsRepository } from '../../posts/application/ports/posts-repository';

import type { ICommentVotesRepository, IPostVotesRepository } from './ports';
import {
  VoteOnCommentUseCase,
  VoteOnPostUseCase,
  CastInitialUpvoteOnCommentUseCase,
} from './use-cases';

export class VotesService {
  constructor(
    private membersRepository: IMembersRepository,
    private commentsRepository: ICommentsRepository,
    private postsRepository: IPostsRepository,
    private postVotesRepository: IPostVotesRepository,
    private commentVotesRepository: ICommentVotesRepository,
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

  public CastInitialUpvoteOnComment(
    command: CastInitialUpvoteOnCommentCommand,
  ) {
    return new CastInitialUpvoteOnCommentUseCase(
      this.commentsRepository,
      this.commentVotesRepository,
      this.eventBus,
    ).execute(command);
  }
}
