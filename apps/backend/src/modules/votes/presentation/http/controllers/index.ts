import { VotesService } from '../../../application/votes-service';

import { CastVoteOnPostController } from './cast-vote-on-post-controller';

export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  public CastVoteOnPost(): CastVoteOnPostController {
    return new CastVoteOnPostController(this.votesService);
  }
}
