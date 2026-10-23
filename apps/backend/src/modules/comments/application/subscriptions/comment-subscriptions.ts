import { IEventBus } from '@forumate/bus';
import { IEventSubscriptions } from '@forumate/core';

import { CommentPosted } from '../../domain/events/comment-posted';
import { CommentProjector } from '../projections/comment-projector';

export class CommentSubscriptions implements IEventSubscriptions {
  constructor(
    private eventBus: IEventBus,
    private commentProjector: CommentProjector,
  ) {}

  public register(): void {
    this.eventBus.subscribe<CommentPosted>(
      CommentPosted.eventName,
      this.onCommentPosted.bind(this),
    );
    this.eventBus.subscribe<CommentPosted>(
      CommentPosted.eventName,
      this.onReplyPosted.bind(this),
    );
  }

  private async onCommentPosted(event: CommentPosted): Promise<void> {
    await this.commentProjector.projectComment(event.data.commentId);
  }

  private async onReplyPosted(event: CommentPosted): Promise<void> {
    const { parentCommentId } = event.data;
    if (!parentCommentId) return;

    await this.commentProjector.refreshReplyCount(parentCommentId);
  }
}
