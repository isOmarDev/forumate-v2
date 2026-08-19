import { EventBus } from '@forumate/bus';
import { Database } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import { CommentRepository } from '../comments/repos/ports/comment-repository';
import { MembersRepository } from '../members/repos/ports/members-repository';
import { PostsRepository } from '../posts/repos/ports/posts-repository';

import { VotesService } from './application/votes-service';
import { VotesSubscriptions } from './application/votes-subscriptions';
import { ProductionVotesRepository } from './repos/adapters/production-votes-repo';
import { VoteRepository } from './repos/ports/vote-repository';
import { VotesController } from './votes-controller';
import { votesErrorHandler } from './votes-errors';

export class VotesModule extends ApplicationModule {
  private votesRepository: VoteRepository;
  private votesService: VotesService;
  private votesSubscriptions: VotesSubscriptions;
  private votesController: VotesController;

  private constructor(
    private db: Database,
    private membersRepository: MembersRepository,
    private commentRepository: CommentRepository,
    private postsRepository: PostsRepository,
    private eventBus: EventBus,
    config: Config,
  ) {
    super(config);
    this.votesRepository = this.createVotesRepository();
    this.votesService = this.createVotesService();
    this.votesSubscriptions = this.createVotesSubscriptions();
    this.votesController = this.createVotesController();
  }

  static build(
    db: Database,
    membersRepo: MembersRepository,
    commentsRepo: CommentRepository,
    postsRepo: PostsRepository,
    eventBus: EventBus,
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

  private createVotesService() {
    return new VotesService(
      this.membersRepository,
      this.commentRepository,
      this.postsRepository,
      this.votesRepository,
      this.eventBus,
    );
  }

  private createVotesSubscriptions() {
    return new VotesSubscriptions(this.eventBus, this.votesService);
  }

  private createVotesRepository() {
    if (this.votesRepository) return this.votesRepository;

    return new ProductionVotesRepository(this.db);
  }

  public getVotesRepository() {
    return this.votesRepository;
  }

  public getVotesService() {
    return this.votesService;
  }

  private createVotesController() {
    return new VotesController(this.votesService, votesErrorHandler);
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter('/votes', this.votesController.getRouter());
  }
}
