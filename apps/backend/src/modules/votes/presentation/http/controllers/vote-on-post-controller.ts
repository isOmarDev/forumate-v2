import express from 'express';

import { VoteOnPostCommand } from '@forumate/api/votes';

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

    const result = await this.votesService.voteOnPost(
      commandOrError.getValue(),
    );

    if (result.isFailure) {
      return this.fail(res, result.getError());
    }

    return this.ok(res, result.getValue().toDTO());
  }
}
