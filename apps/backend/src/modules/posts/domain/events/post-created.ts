import { DomainEvent } from '@forumate/core';

type PostCreatedData = {
  postId: string;
  memberId: string;
};

export class PostCreated extends DomainEvent<PostCreatedData> {
  constructor(postId: string, memberId: string) {
    super('PostCreated', postId, { postId, memberId });
  }
}
