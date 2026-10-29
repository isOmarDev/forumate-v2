import { BaseRouter } from '../../../../../shared/infra/http';
import { VotesController } from '../controllers';

export class VotesRouter extends BaseRouter {
  public readonly basePath: string = '/';

  constructor(private controller: VotesController) {
    super();
  }

  protected setupRoutes() {
    const voteOnPost = this.controller.voteOnPost();
    const voteOnComment = this.controller.voteOnComment();

    this.router.post('/posts/:postId/vote', voteOnPost.execute);
    this.router.post('/comments/:commentId/vote', voteOnComment.execute);
  }
}
