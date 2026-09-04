import { type IEventBus } from '@forumate/bus';
import { type IDatabase } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import { IMembersRepository } from '../members/repos/ports/members-repository';
import { IPostsRepository } from '../posts/repos/ports/posts-repository';

import { CommentsService } from './application/comments-service';
import { ICommentsRepository } from './domain/ports/comments-repository';
import { PrismaCommentsRepository } from './infrastructure/repositories/prisma-comment-repository';
import { CommentsControllers } from './presentation/http/controllers';
import { CommentsRouter } from './presentation/http/routes/comments-router';

export class CommentsModule extends ApplicationModule {
  private commentsRepository: ICommentsRepository;
  private commentsService: CommentsService;
  private commentsControllers: CommentsControllers;
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
    this.commentsControllers = this.createCommentsControllers();
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

  private createCommentsControllers(): CommentsControllers {
    return new CommentsControllers(this.commentsService);
  }

  private createCommentsRouter() {
    return new CommentsRouter(this.commentsControllers);
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
    return this.commentsControllers;
  }
}
