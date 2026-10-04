import { DomainEvent } from '@forumate/core';

type CommentUpvotedData = {
  commentVoteId: string;
  commentId: string;
  memberId: string;
};

export class CommentUpvoted extends DomainEvent<CommentUpvotedData> {
  static readonly eventName = 'CommentUpvoted';

  constructor(commentVoteId: string, commentId: string, memberId: string) {
    super(CommentUpvoted.eventName, commentVoteId, {
      commentVoteId,
      commentId,
      memberId,
    });
  }
}
