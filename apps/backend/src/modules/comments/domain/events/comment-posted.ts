import { DomainEvent } from '@forumate/core';

type CommentPostedData = {
  commentId: string;
  memberId: string;
  postId: string;
};

export class CommentPosted extends DomainEvent<CommentPostedData> {
  static readonly eventName = 'CommentPosted';

  constructor(commentId: string, memberId: string, postId: string) {
    super(CommentPosted.eventName, commentId, { commentId, memberId, postId });
  }
}
