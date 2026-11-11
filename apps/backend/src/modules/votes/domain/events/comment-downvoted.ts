import { DomainEvent } from '@forumate/core/domain';

import type { CommentVoteEventData } from './types';

export class CommentDownvoted extends DomainEvent<CommentVoteEventData> {
  static readonly eventName = 'CommentDownvoted';

  constructor(data: CommentVoteEventData) {
    super(CommentDownvoted.eventName, data.voteId, data);
  }
}
