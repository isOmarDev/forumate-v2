import { DomainEvent } from '@forumate/core';

type CommentPostedData = {
  commentId: string;
  memberId: string;
  postId: string;
};

export class CommentPosted extends DomainEvent<CommentPostedData> {
  constructor(commentId: string, memberId: string, postId: string) {
    super('CommentPosted', commentId, { commentId, memberId, postId });
  }
}
