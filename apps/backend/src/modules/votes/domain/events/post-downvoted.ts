import { DomainEvent } from '@forumate/core';

type PostDownvotedData = {
  postVoteId: string;
  postId: string;
  memberId: string;
};

export class PostDownvoted extends DomainEvent<PostDownvotedData> {
  constructor(postVoteId: string, postId: string, memberId: string) {
    super('PostDownvoted', postVoteId, {
      postVoteId,
      postId,
      memberId,
    });
  }
}
