import { randomUUID } from 'node:crypto';

import { DomainEvent } from '@forumate/core';

export class PostDownvoted extends DomainEvent {
  constructor(
    public readonly postId: string,
    public readonly memberId: string,
    public readonly id: string = randomUUID(),
    public readonly date: Date = new Date(),
  ) {
    super(id, date, 'PostDownvoted');
  }
}
