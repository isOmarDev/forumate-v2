import { DomainEvent } from '@forumate/core';

type CommentDownvotedData = {
  commentVoteId: string;
  commentId: string;
  memberId: string;
};

export class CommentDownvoted extends DomainEvent<CommentDownvotedData> {
  static readonly eventName = 'CommentDownvoted';

  constructor(commentVoteId: string, commentId: string, memberId: string) {
    super(CommentDownvoted.eventName, commentVoteId, {
      commentVoteId,
      commentId,
      memberId,
    });
  }
}
