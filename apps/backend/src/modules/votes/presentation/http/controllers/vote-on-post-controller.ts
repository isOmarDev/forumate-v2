import express from 'express';

import { VoteOnPostCommand, VoteOnPostDto } from '@forumate/api/votes';

import { BaseController } from '../../../../../shared/infra/http';
import { VotesService } from '../../../application/votes-service';

type RequestParams = { postId: string };

export class VoteOnPostController extends BaseController {
  constructor(private votesService: VotesService) {
    super();
  }

  async executeImpl(
    req: express.Request<RequestParams>,
    res: express.Response,
  ) {
    const postId = req.params.postId;
    const payload = req.body;
    const commandOrError = VoteOnPostCommand.create({
      postId,
      ...payload,
    });

    if (commandOrError.isFailure) {
      return this.fail(res, commandOrError.getError());
    }

    const resultOrError = await this.votesService.voteOnPost(
      commandOrError.getValue(),
    );

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    const postVote = resultOrError.getValue();

    return this.ok<VoteOnPostDto>(res, {
      postId: postVote.postId,
      voteStatus: postVote.voteStatus.value,
    });
  }
}
