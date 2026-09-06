import { IEventBus } from '@forumate/bus';
import { IDatabase } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import type { IMembersRepository } from '../members/application/ports/members-repository';

import type { IPostsRepository } from './application/ports/posts-repository';
import { PostsService } from './application/posts-service';
import { InMemoryPostsRepository } from './infrastructure/repositories/in-memory-posts-repository';
import { PrismaPostsRepository } from './infrastructure/repositories/prisma-posts-repository';
import { PostsController } from './presentation/http/controllers';
import { PostsRouter } from './presentation/http/routes/posts-router';

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
    this.postsService = this.createPostsService();
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

    return new PrismaPostsRepository(this.database);
  }

  private createPostsService() {
    return new PostsService(
      this.postsRepository,
      this.membersRepository,
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
