import { DomainEvent } from '@forumate/core';

type PostCreatedData = {
  postId: string;
  memberId: string;
};

export class PostCreated extends DomainEvent<PostCreatedData> {
  static readonly eventName = 'PostCreated';

  constructor(postId: string, memberId: string) {
    super(PostCreated.eventName, postId, { postId, memberId });
  }
}
