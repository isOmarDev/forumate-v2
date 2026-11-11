import express from 'express';

import { VoteOnCommentCommand, VoteOnCommentDto } from '@forumate/api/votes';

import { BaseController } from '../../../../../shared/infra/http';
import { VotesService } from '../../../application/votes-service';

type RequestParams = { commentId: string };

export class VoteOnCommentController extends BaseController {
  constructor(private readonly votesService: VotesService) {
    super();
  }

  async executeImpl(
    req: express.Request<RequestParams>,
    res: express.Response,
  ) {
    const commentId = req.params.commentId;
    const payload = req.body;
    const commandOrError = VoteOnCommentCommand.create({
      commentId,
      ...payload,
    });

    if (commandOrError.isFailure) {
      return this.fail(res, commandOrError.getError());
    }

    const resultOrError = await this.votesService.voteOnComment(
      commandOrError.getValue(),
    );

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    const commentVote = resultOrError.getValue();

    this.ok<VoteOnCommentDto>(res, {
      commentId: commentVote.commentId,
      voteStatus: commentVote.voteStatus.value,
    });
  }
}
