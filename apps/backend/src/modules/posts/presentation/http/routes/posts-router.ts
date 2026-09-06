import { BaseRouter } from '../../../../../shared/infra/http';
import type { PostsController } from '../controllers';

export class PostsRouter extends BaseRouter {
  public readonly basePath: string = '/posts';

  constructor(private controller: PostsController) {
    super();
  }

  protected setupRoutes(): void {
    const createPost = this.controller.createPost();
    const getPosts = this.controller.getPosts();
    const getPostById = this.controller.getPostById();

    this.router.post('/', createPost.execute);
    this.router.get('/', getPosts.execute);
    this.router.get('/:postId', getPostById.execute);
  }
}
