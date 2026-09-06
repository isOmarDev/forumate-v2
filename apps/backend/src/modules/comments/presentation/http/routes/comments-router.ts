import { BaseRouter } from '../../../../../shared/infra/http';
import { CommentsController } from '../controllers';

export class CommentsRouter extends BaseRouter {
  public readonly basePath: string = '/posts';

  constructor(private controller: CommentsController) {
    super();
  }

  protected setupRoutes(): void {
    const getCommentsByPostId = this.controller.getCommentsByPostId();
    const postComment = this.controller.postComment();

    this.router.get('/:postId/comments', getCommentsByPostId.execute);
    this.router.post('/:postId/comments', postComment.execute);
  }
}
