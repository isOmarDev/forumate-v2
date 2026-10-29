import { VotesService } from '../../../application/votes-service';

import { VoteOnCommentController } from './vote-on-comment-controller';
import { VoteOnPostController } from './vote-on-post-controller';

export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  public voteOnPost() {
    return new VoteOnPostController(this.votesService);
  }

  public voteOnComment() {
    return new VoteOnCommentController(this.votesService);
  }
}
