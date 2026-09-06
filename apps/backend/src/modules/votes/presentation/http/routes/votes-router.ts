import { BaseRouter } from '../../../../../shared/infra/http';
import { VotesController } from '../controllers';

export class VotesRouter extends BaseRouter {
  public readonly basePath: string = '/votes';

  constructor(private controller: VotesController) {
    super();
  }

  protected setupRoutes() {
    const castVoteOnPost = this.controller.CastVoteOnPost();

    this.router.post('/post/:postId/new', castVoteOnPost.execute);
  }
}
