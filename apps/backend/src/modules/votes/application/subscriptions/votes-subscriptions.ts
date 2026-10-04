import { UpdateMemberReputationScoreCommand } from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';

import { CommentDownvoted } from '../../domain/events/comment-downvoted';
import { CommentUpvoted } from '../../domain/events/comment-upvoted';
import { PostDownvoted } from '../../domain/events/post-downvoted';
import { PostUpvoted } from '../../domain/events/post-upvoted';
import { VotesService } from '../votes-service';

export class VotesSubscriptions {
  constructor(
    private eventBus: IEventBus,
    private voteService: VotesService,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    this.eventBus.subscribe<PostUpvoted>(
      PostUpvoted.eventName,
      this.onPostOrCommentVoteChanged.bind(this),
    );
    this.eventBus.subscribe<PostDownvoted>(
      PostDownvoted.eventName,
      this.onPostOrCommentVoteChanged.bind(this),
    );
    this.eventBus.subscribe<CommentUpvoted>(
      CommentUpvoted.eventName,
      this.onPostOrCommentVoteChanged.bind(this),
    );
    this.eventBus.subscribe<CommentDownvoted>(
      CommentDownvoted.eventName,
      this.onPostOrCommentVoteChanged.bind(this),
    );
  }

  async onPostOrCommentVoteChanged(
    event: CommentUpvoted | PostUpvoted | CommentDownvoted | CommentUpvoted,
  ) {
    try {
      console.log('updating member reputation score based on post vote');
      const command = new UpdateMemberReputationScoreCommand({
        memberId: event.data.memberId,
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
