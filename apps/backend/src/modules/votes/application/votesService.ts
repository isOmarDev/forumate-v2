import { UpdateMemberReputationScore } from './useCases/updateMemberReputation/updateMemberReputationScore';
import { VoteOnPost } from './useCases/voteOnPost/voteOnPost';
import { VoteOnComment } from './useCases/voteOnComment/voteOnComment';
import { CommentRepository } from '../../comments/repos/ports/commentRepository';
import { MembersRepository } from '../../members/repos/ports/membersRepository';
import { PostsRepository } from '../../posts/repos/ports/postsRepository';
import { VoteRepository } from '../repos/ports/voteRepository';
import {
  UpdateMemberReputationScoreCommand,
  VoteOnCommentCommand,
  VoteOnPostCommand,
} from '@forumate/api/votes';
import { EventBus } from '@forumate/bus';

export class VotesService {
  constructor(
    private memberRepository: MembersRepository,
    private commentRepository: CommentRepository,
    private postRepository: PostsRepository,
    private voteRepository: VoteRepository,
    private eventBus: EventBus,
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
