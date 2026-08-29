import { BaseRouter } from '../../shared/infra/http';

import { type VotesController } from './votes-controller';

export class VotesRouter extends BaseRouter {
  public readonly basePath: string = '/votes';

  constructor(private controller: VotesController) {
    super();
  }

  protected setupRoutes(): void {
    this.router.post('/post/:postId/new', this.controller.castVoteOnPost);
  }
}
