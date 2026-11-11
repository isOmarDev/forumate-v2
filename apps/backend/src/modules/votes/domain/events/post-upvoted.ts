import { DomainEvent } from '@forumate/core/domain';

import type { PostVoteEventData } from './types';

export class PostUpvoted extends DomainEvent<PostVoteEventData> {
  static readonly eventName = 'PostUpvoted';

  constructor(data: PostVoteEventData) {
    super(PostUpvoted.eventName, data.voteId, data);
  }
}
