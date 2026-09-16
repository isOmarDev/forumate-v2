import { DomainEvent } from '@forumate/core';

type PostUpvotedData = {
  postVoteId: string;
  postId: string;
  memberId: string;
};

export class PostUpvoted extends DomainEvent<PostUpvotedData> {
  constructor(postVoteId: string, postId: string, memberId: string) {
    super('PostUpvoted', postVoteId, {
      postVoteId,
      postId,
      memberId,
    });
  }
}
