import { faker } from '@faker-js/faker';

import {
  type VoteOnPostInput,
  type VoteOnCommentInput,
  voteTypeSchema,
  VoteType,
} from '@forumate/api/votes';

type VoteInput = { memberId: string; voteType: string };

abstract class VoteInputBuilder<T extends VoteInput> {
  protected readonly props: T;

  constructor(specificProps: Omit<T, keyof VoteInput>) {
    this.props = {
      memberId: faker.string.uuid(),
      voteType: voteTypeSchema.enum.upvote,
      ...specificProps,
    } as T;
  }

  public withMemberId(memberId: string): this {
    this.props.memberId = memberId;
    return this;
  }

  public withVoteType(voteType: VoteType): this {
    this.props.voteType = voteType;
    return this;
  }

  public asUpvote() {
    return this.withVoteType('upvote');
  }

  public asDownvote() {
    return this.withVoteType('downvote');
  }

  public build(): T {
    return this.props;
  }
}

class PostVoteInputBuilder extends VoteInputBuilder<VoteOnPostInput> {
  constructor() {
    super({
      postId: faker.string.uuid(),
    });
  }

  public withPostId(id: string): this {
    this.props.postId = id;
    return this;
  }
}

class CommentVoteInputBuilder extends VoteInputBuilder<VoteOnCommentInput> {
  constructor() {
    super({
      commentId: faker.string.uuid(),
    });
  }

  public withCommentId(id: string): this {
    this.props.commentId = id;
    return this;
  }
}

export class VoteInputBuilders {
  public static aPostVote(): PostVoteInputBuilder {
    return new PostVoteInputBuilder();
  }

  public static aCommentVote(): CommentVoteInputBuilder {
    return new CommentVoteInputBuilder();
  }
}
