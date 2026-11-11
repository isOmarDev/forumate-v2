import { DomainEvent } from '@forumate/core/domain';

import type { CommentVoteEventData } from './types';

export class CommentUnvoted extends DomainEvent<CommentVoteEventData> {
  static readonly eventName = 'CommentUnvoted';

  constructor(data: Omit<CommentVoteEventData, 'value'>) {
    super(CommentUnvoted.eventName, data.voteId, data);
  }
}
