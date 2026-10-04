import { DomainEvent } from '@forumate/core';

type PostDownvotedData = {
  postVoteId: string;
  postId: string;
  memberId: string;
};

export class PostDownvoted extends DomainEvent<PostDownvotedData> {
  static readonly eventName = 'PostDownvoted';

  constructor(postVoteId: string, postId: string, memberId: string) {
    super(PostDownvoted.eventName, postVoteId, {
      postVoteId,
      postId,
      memberId,
    });
  }
}
