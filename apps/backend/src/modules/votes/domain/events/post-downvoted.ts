import { DomainEvent } from '@forumate/core/domain';

import type { PostVoteEventData } from './types';

export class PostDownvoted extends DomainEvent<PostVoteEventData> {
  static readonly eventName = 'PostDownvoted';

  constructor(data: PostVoteEventData) {
    super(PostDownvoted.eventName, data.voteId, data);
  }
}
