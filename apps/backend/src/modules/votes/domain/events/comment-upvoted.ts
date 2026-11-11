import { DomainEvent } from '@forumate/core/domain';

import type { CommentVoteEventData } from './types';

export class CommentUpvoted extends DomainEvent<CommentVoteEventData> {
  static readonly eventName = 'CommentUpvoted';

  constructor(data: CommentVoteEventData) {
    super(CommentUpvoted.eventName, data.voteId, data);
  }
}
