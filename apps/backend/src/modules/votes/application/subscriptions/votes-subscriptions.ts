import { UpdateMemberReputationScoreCommand } from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';
import { IEventSubscriptions } from '@forumate/core/application';

import { CommentDownvoted } from '../../domain/events/comment-downvoted';
import { CommentUpvoted } from '../../domain/events/comment-upvoted';
import { PostDownvoted } from '../../domain/events/post-downvoted';
import { PostUpvoted } from '../../domain/events/post-upvoted';
import { VotesService } from '../votes-service';

export class VotesSubscriptions implements IEventSubscriptions {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly voteService: VotesService,
  ) {}

  register() {
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

  private async onPostOrCommentVoteChanged(
    event: PostUpvoted | PostDownvoted | CommentUpvoted | CommentDownvoted,
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
