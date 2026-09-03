import { type IEventBus } from '@forumate/bus';
import { type IDatabase } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import { IMembersRepository } from '../members/repos/ports/members-repository';
import { IPostsRepository } from '../posts/repos/ports/posts-repository';

import { CommentsService } from './application/comments-service';
import { CommentsController } from './comments-controller';
import { CommentsRouter } from './comments-router';
import { ProductionCommentsRepository } from './repos/adapters/production-comment-repository';
import { ICommentRepository } from './repos/ports/comment-repository';

export class CommentsModule extends ApplicationModule {
  private commentsRepository: ICommentRepository;
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

    this.setupRoutes();
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
    return new ProductionCommentsRepository(this.db);
  }

  private createCommentsService() {
    return new CommentsService(
      this.commentsRepository,
      this.postsRepository,
      this.membersRepository,
      this.eventBus,
    );
  }

  private createCommentsController() {
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

  private setupRoutes() {
    this.commentsRouter.register();
  }

  public getCommentsRepository() {
    return this.commentsRepository;
  }

  public getCommentsService() {
    return this.commentsService;
  }
}
