import { BaseRouter } from '../../shared/infra/http';

import { type PostsController } from './posts-controller';

export class PostsRouter extends BaseRouter {
  public readonly basePath: string = '/posts';

  constructor(private controller: PostsController) {
    super();
  }

  protected setupRoutes(): void {
    this.router.get('/', this.controller.getPosts);
    this.router.post('/', this.controller.createPost);
    this.router.get('/:postId', this.controller.getPostById);
  }
}
