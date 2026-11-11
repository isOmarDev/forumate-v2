import { type IEventBus } from '@forumate/bus';
import { type IDatabase } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import type { ICommentsRepository } from '../comments/application/ports/comments-repository';
import type { IMembersRepository } from '../members/application/ports/members-repository';
import type { IPostsRepository } from '../posts/application/ports/posts-repository';

import type {
  IPostVotesRepository,
  ICommentVotesRepository,
} from './application/ports';
import { VotesSubscriptions } from './application/subscriptions/votes-subscriptions';
import { VotesService } from './application/votes-service';
import {
  InMemoryCommentVotesRepository,
  InMemoryPostVotesRepository,
} from './infrastructure/repositories/in-memory';
import {
  PrismaPostVotesRepository,
  PrismaCommentVotesRepository,
} from './infrastructure/repositories/prisma';
import { VotesController } from './presentation/http/controllers';
import { VotesRouter } from './presentation/http/routes/votes-router';

export class VotesModule extends ApplicationModule {
  private postVotesRepository: IPostVotesRepository;
  private commentVotesRepository: ICommentVotesRepository;

  private votesService: VotesService;
  private votesSubscriptions: VotesSubscriptions;
  private votesController: VotesController;
  private votesRouter: VotesRouter;

  private constructor(
    private db: IDatabase,
    private membersRepository: IMembersRepository,
    private commentsRepository: ICommentsRepository,
    private postsRepository: IPostsRepository,
    private eventBus: IEventBus,
    config: Config,
  ) {
    super(config);

    this.postVotesRepository = this.createPostVotesRepository();
    this.commentVotesRepository = this.createCommentVotesRepository();

    this.votesService = this.createVotesService();
    this.votesSubscriptions = this.createVotesSubscriptions();
    this.votesController = this.createVotesController();
    this.votesRouter = this.createVotesRouter();

    this.setupRoutes();
    this.setupSubscriptions();
  }

  public static build(
    db: IDatabase,
    membersRepository: IMembersRepository,
    commentsRepository: ICommentsRepository,
    postsRepository: IPostsRepository,
    eventBus: IEventBus,
    config: Config,
  ): VotesModule {
    return new VotesModule(
      db,
      membersRepository,
      commentsRepository,
      postsRepository,
      eventBus,
      config,
    );
  }

  // ---- Write repositories ----

  private createPostVotesRepository(): IPostVotesRepository {
    if (this.shouldBuildFakeRepository) {
      return new InMemoryPostVotesRepository();
    }

    return new PrismaPostVotesRepository(this.db);
  }

  private createCommentVotesRepository(): ICommentVotesRepository {
    if (this.shouldBuildFakeRepository) {
      return new InMemoryCommentVotesRepository();
    }

    return new PrismaCommentVotesRepository(this.db);
  }

  // ---- Services ----

  private createVotesService(): VotesService {
    return new VotesService(
      this.membersRepository,
      this.commentsRepository,
      this.postsRepository,
      this.postVotesRepository,
      this.commentVotesRepository,
      this.eventBus,
    );
  }

  private createVotesSubscriptions(): VotesSubscriptions {
    return new VotesSubscriptions(this.eventBus, this.votesService);
  }

  private createVotesController(): VotesController {
    return new VotesController(this.votesService);
  }

  private createVotesRouter(): VotesRouter {
    return new VotesRouter(this.votesController);
  }

  // ---- Setup ----

  private setupSubscriptions(): void {
    this.votesSubscriptions.register();
  }

  private setupRoutes(): void {
    this.votesRouter.register();
  }

  public mountRouter(webServer: WebServer): void {
    webServer.mountRouter(
      this.votesRouter.basePath,
      this.votesRouter.getRouter(),
    );
  }

  // ---- Public accessors ----

  public getPostVotesRepository() {
    return this.postVotesRepository;
  }

  public getCommentVotesRepository() {
    return this.commentVotesRepository;
  }

  public getVotesService(): VotesService {
    return this.votesService;
  }

  public getVotesController(): VotesController {
    return this.votesController;
  }
}
