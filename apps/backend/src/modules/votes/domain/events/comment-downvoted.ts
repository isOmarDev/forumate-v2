import { randomUUID } from 'node:crypto';

import { DomainEvent } from '@forumate/core';

export class CommentDownvoted extends DomainEvent {
  constructor(
    public readonly commentId: string,
    public readonly memberId: string,
    public readonly id: string = randomUUID(),
    public readonly date: Date = new Date(),
  ) {
    super(id, date, 'CommentDownvoted');
  }
}
