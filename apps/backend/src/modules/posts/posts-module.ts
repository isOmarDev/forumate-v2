import { IEventBus } from '@forumate/bus';
import { IDatabase } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import { IMembersRepository } from '../members/repos/ports/members-repository';

import { PostsService } from './application/posts-service';
import { PostsController } from './posts-controller';
import { PostsRouter } from './posts-router';
import { InMemoryPostsRepository } from './repos/adapters/in-memory-posts-repository';
import { ProductionPostsRepository } from './repos/adapters/production-posts-repository';
import { IPostsRepository } from './repos/ports/posts-repository';

export class PostsModule extends ApplicationModule {
  private postsRepository: IPostsRepository;
  private postsService: PostsService;
  private postsController: PostsController;
  private postsRouter: PostsRouter;

  private constructor(
    config: Config,
    private database: IDatabase,
    private eventBus: IEventBus,
    private membersRepository: IMembersRepository,
  ) {
    super(config);

    this.postsRepository = this.createPostsRepository();
    this.postsService = this.createPostsService(membersRepository);
    this.postsController = this.createPostsController();
    this.postsRouter = this.createPostsRouter();

    this.setupRoutes();
  }

  static build(
    db: IDatabase,
    config: Config,
    eventBus: IEventBus,
    membersRepository: IMembersRepository,  
  ) {
    return new PostsModule(config, db, eventBus, membersRepository);
  }

  private createPostsRepository() {
    if (this.shouldBuildFakeRepository) {
      return new InMemoryPostsRepository();
    }

    return new ProductionPostsRepository(this.database);
  }

  private createPostsService(membersRepository: IMembersRepository) {
    return new PostsService(
      this.postsRepository,
      membersRepository,
      this.eventBus,
    );
  }

  private createPostsController() {
    return new PostsController(this.postsService);
  }

  private createPostsRouter() {
    return new PostsRouter(this.postsController);
  }

  private setupRoutes() {
    this.postsRouter.register();
  }

  public mountRouter(webServer: WebServer) {
    const path = this.postsRouter.basePath;
    const router = this.postsRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  public getPostsRepository() {
    return this.postsRepository;
  }

  public getPostsService() {
    return this.postsService;
  }

  public getPostsController() {
    return this.postsController;
  }
}
