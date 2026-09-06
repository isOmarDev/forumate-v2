import { type IEventBus } from '@forumate/bus';
import { type IDatabase } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import type { ICommentsRepository } from '../comments/application/ports/comments-repository';
import type { IMembersRepository } from '../members/application/ports/members-repository';
import type { IPostsRepository } from '../posts/application/ports/posts-repository';

import type { IVotesRepository } from './application/ports/votes-repository';
import { VotesSubscriptions } from './application/subscriptions/votes-subscriptions';
import { VotesService } from './application/votes-service';
import { prismaVotesRepository } from './infrastructure/repositories/prisma-votes-repo';
import { VotesController } from './presentation/http/controllers';
import { VotesRouter } from './presentation/http/routes/votes-router';

export class VotesModule extends ApplicationModule {
  private votesRepository: IVotesRepository;
  private votesService: VotesService;
  private votesSubscriptions: VotesSubscriptions;
  private votesController: VotesController;
  private votesRouter: VotesRouter;

  private constructor(
    private db: IDatabase,
    private membersRepository: IMembersRepository,
    private commentRepository: ICommentsRepository,
    private postsRepository: IPostsRepository,
    private eventBus: IEventBus,
    config: Config,
  ) {
    super(config);

    this.votesRepository = this.createVotesRepository();
    this.votesService = this.createVotesService();
    this.votesSubscriptions = this.createVotesSubscriptions();
    this.votesController = this.createVotesController();
    this.votesRouter = this.createPostsRouter();

    this.setupRoutes();
  }

  static build(
    db: IDatabase,
    membersRepo: IMembersRepository,
    commentsRepo: ICommentsRepository,
    postsRepo: IPostsRepository,
    eventBus: IEventBus,
    config: Config,
  ) {
    return new VotesModule(
      db,
      membersRepo,
      commentsRepo,
      postsRepo,
      eventBus,
      config,
    );
  }

  private createVotesRepository() {
    if (this.shouldBuildFakeRepository) {
      return new prismaVotesRepository(this.db); // change to in memory repo
    }

    return new prismaVotesRepository(this.db);
  }

  private createVotesService() {
    return new VotesService(
      this.membersRepository,
      this.commentRepository,
      this.postsRepository,
      this.votesRepository,
      this.eventBus,
    );
  }

  private createVotesController() {
    return new VotesController(this.votesService);
  }

  private createPostsRouter() {
    return new VotesRouter(this.votesController);
  }

  private createVotesSubscriptions() {
    return new VotesSubscriptions(this.eventBus, this.votesService);
  }

  private setupRoutes() {
    this.votesRouter.register();
  }

  public mountRouter(webServer: WebServer) {
    const path = this.votesRouter.basePath;
    const router = this.votesRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  public getVotesRepository() {
    return this.votesRepository;
  }

  public getVotesService() {
    return this.votesService;
  }

  public getVotesController() {
    return this.votesController;
  }
}
