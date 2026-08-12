import { Request } from '@forumate/core';
import { MissingRequestParamsError } from '@forumate/errors/server';

import { VoteOnCommentInput, VoteOnPostInput } from './inputs';

export class UpdateMemberReputationScoreCommand {
  constructor(
    public readonly props: {
      memberId: string;
    },
  ) {}
}

export class VoteOnCommentCommand {
  constructor(public props: VoteOnCommentInput) {}

  static fromRequest(body: Request['body']) {
    const { voteType, commentId, memberId } = body;

    if (!commentId) {
      throw new MissingRequestParamsError(['commentId']);
    }

    if (!voteType) {
      throw new MissingRequestParamsError(['voteType']);
    }

    if (!memberId) {
      throw new MissingRequestParamsError(['memberId']);
    }

    return new VoteOnCommentCommand({ ...body });
  }
}

export class VoteOnPostCommand {
  constructor(public props: VoteOnPostInput) {}

  static fromRequest(body: Request['body']) {
    const { voteType, postId, memberId } = body;

    if (!postId) {
      throw new MissingRequestParamsError(['postId']);
    }

    if (!voteType) {
      throw new MissingRequestParamsError(['voteType']);
    }

    if (!memberId) {
      throw new MissingRequestParamsError(['memberId']);
    }

    return new VoteOnCommentCommand({ ...body });
  }
}