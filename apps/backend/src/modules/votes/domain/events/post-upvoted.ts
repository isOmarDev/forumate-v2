import { DomainEvent } from '@forumate/core';

type PostUpvotedData = {
  postVoteId: string;
  postId: string;
  memberId: string;
};

export class PostUpvoted extends DomainEvent<PostUpvotedData> {
  static readonly eventName = 'PostUpvoted';

  constructor(postVoteId: string, postId: string, memberId: string) {
    super(PostUpvoted.eventName, postVoteId, {
      postVoteId,
      postId,
      memberId,
    });
  }
}
