import express from 'express';

import { VoteOnPostCommand } from '@forumate/api/votes';

import { BaseController } from '../../shared/infra/http';

import { VotesService } from './application/votes-service';

export class VotesController extends BaseController {
  constructor(private votesService: VotesService) {
    super();
  }

  public castVoteOnPost = async (
    req: express.Request,
    res: express.Response,
  ) => {
    const command = new VoteOnPostCommand({
      postId: req.params.postId as string,
      voteType: req.body.voteType,
      memberId: req.body.memberId,
    });

    const result = await this.votesService.castVoteOnPost(command);

    if (result.isFailure) {
      return this.fail(res, result.getError());
    }

    return this.ok(res, result.getValue().toDTO());
  };
}
