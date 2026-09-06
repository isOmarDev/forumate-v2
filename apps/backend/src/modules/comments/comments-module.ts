import { type IEventBus } from '@forumate/bus';
import { type IDatabase } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import type { IMembersRepository } from '../members/application/ports/members-repository';
import type { IPostsRepository } from '../posts/application/ports/posts-repository';

import { CommentsService } from './application/comments-service';
import type { ICommentsRepository } from './application/ports/comments-repository';
import { PrismaCommentsRepository } from './infrastructure/repositories/prisma-comments-repository';
import { CommentsController } from './presentation/http/controllers';
import { CommentsRouter } from './presentation/http/routes/comments-router';

export class CommentsModule extends ApplicationModule {
  private commentsRepository: ICommentsRepository;
  private commentsService: CommentsService;
  private commentsController: CommentsController;
  private commentsRouter: CommentsRouter;

  private constructor(
    private db: IDatabase,
    private membersRepository: IMembersRepository,
    private postsRepository: IPostsRepository,
    private eventBus: IEventBus,
    config: Config,
  ) {
    super(config);

    this.commentsRepository = this.createCommentRepository();
    this.commentsService = this.createCommentsService();
    this.commentsController = this.createCommentsController();
    this.commentsRouter = this.createCommentsRouter();

    this.registerRoutes();
  }

  static build(
    db: IDatabase,
    membersRepository: IMembersRepository,
    postsRepository: IPostsRepository,
    eventBus: IEventBus,
    config: Config,
  ) {
    return new CommentsModule(
      db,
      membersRepository,
      postsRepository,
      eventBus,
      config,
    );
  }

  private createCommentRepository() {
    if (this.commentsRepository) return this.commentsRepository;
    return new PrismaCommentsRepository(this.db);
  }

  private createCommentsService() {
    return new CommentsService(
      this.commentsRepository,
      this.postsRepository,
      this.membersRepository,
      this.eventBus,
    );
  }

  private createCommentsController(): CommentsController {
    return new CommentsController(this.commentsService);
  }

  private createCommentsRouter() {
    return new CommentsRouter(this.commentsController);
  }

  public mountRouter(webServer: WebServer) {
    const path = this.commentsRouter.basePath;
    const router = this.commentsRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  private registerRoutes() {
    this.commentsRouter.register();
  }

  public getCommentsRepository() {
    return this.commentsRepository;
  }

  public getCommentsService() {
    return this.commentsService;
  }

  public getCommentsControllers() {
    return this.commentsController;
  }
}
