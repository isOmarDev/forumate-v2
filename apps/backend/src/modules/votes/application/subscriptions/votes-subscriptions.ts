import { UpdateMemberReputationScoreCommand } from '@forumate/api/votes';
import { EventBus } from '@forumate/bus';

import { CommentDownvoted } from '../../domain/events/comment-downvoted';
import { CommentUpvoted } from '../../domain/events/comment-upvoted';
import { PostDownvoted } from '../../domain/events/post-downvoted';
import { PostUpvoted } from '../../domain/events/post-upvoted';
import { VotesService } from '../votes-service';

export class VotesSubscriptions {
  constructor(
    private eventBus: EventBus,
    private voteService: VotesService,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    this.eventBus.subscribe<PostUpvoted>(
      PostUpvoted.name,
      this.onPostOrCommentVoteChanged.bind(this),
    );
    this.eventBus.subscribe<PostDownvoted>(
      PostDownvoted.name,
      this.onPostOrCommentVoteChanged.bind(this),
    );
    this.eventBus.subscribe<CommentUpvoted>(
      CommentUpvoted.name,
      this.onPostOrCommentVoteChanged.bind(this),
    );
    this.eventBus.subscribe<CommentDownvoted>(
      CommentDownvoted.name,
      this.onPostOrCommentVoteChanged.bind(this),
    );
  }

  async onPostOrCommentVoteChanged(
    event: CommentUpvoted | PostUpvoted | CommentDownvoted | CommentUpvoted,
  ) {
    try {
      console.log('updating member reputation score based on post vote');
      const command = new UpdateMemberReputationScoreCommand({
        memberId: event.memberId,
      });
      const response =
        await this.voteService.updateMemberReputationScore(command);
      // If not successful, handle.
    } catch (error) {
      console.log(error);
      // Handle
    }
  }
}
