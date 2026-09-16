import { DomainEvent } from '@forumate/core';

type CommentUpvotedData = {
  commentVoteId: string;
  commentId: string;
  memberId: string;
};

export class CommentUpvoted extends DomainEvent<CommentUpvotedData> {
  constructor(commentVoteId: string, commentId: string, memberId: string) {
    super('CommentUpvoted', commentVoteId, {
      commentVoteId,
      commentId,
      memberId,
    });
  }
}
