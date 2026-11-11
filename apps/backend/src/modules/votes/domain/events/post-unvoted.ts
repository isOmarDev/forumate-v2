import { DomainEvent } from '@forumate/core/domain';

import type { PostVoteEventData } from './types';

export class PostUnvoted extends DomainEvent<PostVoteEventData> {
  static readonly eventName = 'PostUnvoted';

  constructor(data: PostVoteEventData) {
    super(PostUnvoted.eventName, data.voteId, data);
  }
}
