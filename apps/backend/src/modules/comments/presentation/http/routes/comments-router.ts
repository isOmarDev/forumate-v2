import { BaseRouter } from '../../../../../shared/infra/http';
import { CommentsControllers } from '../controllers';

export class CommentsRouter extends BaseRouter {
  public readonly basePath: string = '/posts';

  constructor(private controllers: CommentsControllers) {
    super();
  }

  protected setupRoutes(): void {
    const controllers = this.createControllers();

    this.router.get(
      '/:postId/comments',
      controllers.getCommentsByPostId.execute,
    );
    this.router.post('/:postId/comments', controllers.postComment.execute);
  }

  private createControllers() {
    return {
      getCommentsByPostId: this.controllers.getCommentsByPostId(),
      postComment: this.controllers.postComment(),
    };
  }
}
