import {
  UpdateMemberReputationScoreCommand,
  VoteOnCommentCommand,
  VoteOnPostCommand,
} from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';

import { type ICommentRepository } from '../../comments/repos/ports/comment-repository';
import { type IMembersRepository } from '../../members/repos/ports/members-repository';
import { type IPostsRepository } from '../../posts/repos/ports/posts-repository';
import { IVoteRepository } from '../repos/ports/vote-repository';

import { UpdateMemberReputationScore } from './use-cases/update-member-reputation/update-member-reputation-score';
import { VoteOnComment } from './use-cases/vote-on-comment/vote-on-comment';
import { VoteOnPost } from './use-cases/vote-on-post/vote-on-post';

export class VotesService {
  constructor(
    private memberRepository: IMembersRepository,
    private commentRepository: ICommentRepository,
    private postRepository: IPostsRepository,
    private voteRepository: IVoteRepository,
    private eventBus: IEventBus,
  ) {}

  castVoteOnPost(command: VoteOnPostCommand) {
    return new VoteOnPost(
      this.memberRepository,
      this.postRepository,
      this.voteRepository,
      this.eventBus,
    ).execute(command);
  }

  castVoteOnComment(command: VoteOnCommentCommand) {
    return new VoteOnComment(
      this.memberRepository,
      this.commentRepository,
      this.voteRepository,
      this.eventBus,
    ).execute(command);
  }

  updateMemberReputationScore(command: UpdateMemberReputationScoreCommand) {
    return new UpdateMemberReputationScore(
      this.memberRepository,
      this.voteRepository,
      this.eventBus,
    ).execute(command);
  }
}
