import { BaseRouter } from '../../shared/infra/http';

import { type CommentsController } from './comments-controller';

export class CommentsRouter extends BaseRouter {
  public readonly basePath: string = '/posts';

  constructor(private controller: CommentsController) {
    super();
  }

  protected setupRoutes(): void {
    this.router.get('/:postId/comments', this.controller.getCommentsByPostId);
    this.router.post('/:postId/comments', this.controller.postComment);
  }
}
