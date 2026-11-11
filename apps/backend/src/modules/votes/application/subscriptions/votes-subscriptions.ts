import { VoteOnCommentCommand } from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';
import { IEventSubscriptions } from '@forumate/core/application';

import { CommentPosted } from '../../../comments/domain/events/comment-posted';
import { VotesService } from '../votes-service';

export class VotesSubscriptions implements IEventSubscriptions {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly votesService: VotesService,
  ) {}

  public register() {
    this.eventBus.subscribe<CommentPosted>(
      CommentPosted.eventName,
      this.onCommentPosted.bind(this),
    );
  }

  private async onCommentPosted(event: CommentPosted) {
    const { commentId, memberId } = event.data;
    const command = VoteOnCommentCommand.create({
      commentId,
      memberId,
      voteType: 'upvote',
    });

    await this.votesService.CastInitialUpvoteOnComment(command.getValue());
  }
}
