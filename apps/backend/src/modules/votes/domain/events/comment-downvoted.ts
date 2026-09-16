import { DomainEvent } from '@forumate/core';

type CommentDownvotedData = {
  commentVoteId: string;
  commentId: string;
  memberId: string;
};

export class CommentDownvoted extends DomainEvent<CommentDownvotedData> {
  constructor(
    public readonly commentVoteId: string,
    public readonly commentId: string,
    public readonly memberId: string,
  ) {
    super('CommentDownvoted', commentVoteId, {
      commentVoteId,
      commentId,
      memberId,
    });
  }
}
