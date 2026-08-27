import { type Request } from '@forumate/core/application';
import { InvalidRequestBodyError } from '@forumate/errors/request';

import type { VoteOnCommentInput, VoteOnPostInput } from './inputs';

// Update Member Reputation
export class UpdateMemberReputationScoreCommand {
  constructor(
    public readonly props: {
      memberId: string;
    },
  ) {}
}

// Vote On Comment
export class VoteOnCommentCommand {
  constructor(public readonly props: VoteOnCommentInput) {}

  static fromRequest(
    body: Request<VoteOnCommentInput>['body'],
  ): VoteOnCommentCommand {
    const { voteType, commentId, memberId } = body;

    if (!commentId) {
      throw new InvalidRequestBodyError(['commentId']);
    }

    if (!voteType) {
      throw new InvalidRequestBodyError(['voteType']);
    }

    if (!memberId) {
      throw new InvalidRequestBodyError(['memberId']);
    }

    return new VoteOnCommentCommand({
      commentId,
      voteType,
      memberId,
    });
  }
}

// Vote On Post
export class VoteOnPostCommand {
  constructor(public readonly props: VoteOnPostInput) {}

  static fromRequest(
    body: Request<VoteOnPostInput>['body'],
  ): VoteOnPostCommand {
    const { voteType, postId, memberId } = body;

    if (!postId) {
      throw new InvalidRequestBodyError(['postId']);
    }

    if (!voteType) {
      throw new InvalidRequestBodyError(['voteType']);
    }

    if (!memberId) {
      throw new InvalidRequestBodyError(['memberId']);
    }

    return new VoteOnPostCommand({
      postId,
      voteType,
      memberId,
    });
  }
}
