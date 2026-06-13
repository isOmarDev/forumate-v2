import { PostService } from './post-service';
import { PostController } from './post-controller';
import { PostErrors } from './post-errors';
import { IPostRepository } from './ports/post-repository';
import { PrismaPostRepo } from './adapters/prisma-post-repo';
import WebServer from '../../shared/server';
import { Database } from '../../shared/database';
import { Config } from '../../shared/config';
import { ApplicationModule } from '../../shared/modules/application-module';

export class PostModule extends ApplicationModule {
  private postRepo: IPostRepository;
  private postService: PostService;
  private postController: PostController;

  private constructor(private db: Database, config: Config) {
    super(config);
    this.postRepo = this.createPostRepo();
    this.postService = this.createPostService();
    this.postController = this.createPostController();
  }

  static build(db: Database, config: Config) {
    return new PostModule(db, config);
  }

  private createPostRepo() {
    return new PrismaPostRepo(this.db.getClient());
  }

  private createPostService() {
    return new PostService(this.postRepo);
  }

  private createPostController() {
    return new PostController(this.postService, PostErrors);
  }

  getPostRepository() {
    return this.postRepo;
  }

  getPostService() {
    return this.postService;
  }

  getPostController() {
    return this.postController;
  }

  mountRouter(server: WebServer) {
    server.moutRouter('/posts', this.postController.getRouter());
  }
}
