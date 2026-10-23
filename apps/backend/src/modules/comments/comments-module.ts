import { type IEventBus } from '@forumate/bus';
import { type IDatabase } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import type { IMembersRepository } from '../members/application/ports/members-repository';
import type { IPostsRepository } from '../posts/application/ports/posts-repository';

import { CommentsService } from './application/comments-service';
import type {
  ICommentsRepository,
  ICommentsReadRepository,
} from './application/ports';
import { CommentProjector } from './application/projections/comment-projector';
import { CommentSubscriptions } from './application/subscriptions/comment-subscriptions';
import { PrismaCommentsReadRepository } from './infrastructure/repositories/prisma-comments-read-repository';
import { PrismaCommentsRepository } from './infrastructure/repositories/prisma-comments-repository';
import { CommentsController } from './presentation/http/controllers';
import { CommentsRouter } from './presentation/http/routes/comments-router';

export class CommentsModule extends ApplicationModule {
  private commentsRepository: ICommentsRepository;
  private commentsReadRepository: ICommentsReadRepository;
  private commentsService: CommentsService;
  private commentProjector: CommentProjector;
  private commentSubscriptions: CommentSubscriptions;
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

    this.commentsRepository = this.createCommentsRepository();
    this.commentsReadRepository = this.createCommentReadRepository();
    this.commentsService = this.createCommentsService();
    this.commentProjector = this.createCommentProjector();
    this.commentSubscriptions = this.createCommentSubscriptions();
    this.commentsController = this.createCommentsController();
    this.commentsRouter = this.createCommentsRouter();

    this.registerRoutes();
    this.setupSubscriptions();
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

  private setupSubscriptions() {
    this.commentSubscriptions.register();
  }

  private createCommentsRepository() {
    if (this.commentsRepository) return this.commentsRepository;
    return new PrismaCommentsRepository(this.db);
  }

  private createCommentReadRepository() {
    if (this.commentsReadRepository) return this.commentsReadRepository;
    return new PrismaCommentsReadRepository(this.db);
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

  private createCommentProjector() {
    return new CommentProjector(this.db, this.commentsReadRepository);
  }

  private createCommentSubscriptions() {
    return new CommentSubscriptions(this.eventBus, this.commentProjector);
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
