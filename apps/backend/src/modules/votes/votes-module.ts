import { ApplicationModule } from '../../shared/modules/application-module';
import { VoteRepository } from './repos/ports/vote-repository';
import { VotesService } from './application/votes-service';
import { ProductionVotesRepository } from './repos/adapters/production-votes-repo';
import { MembersRepository } from '../members/repos/ports/members-repository';
import { CommentRepository } from '../comments/repos/ports/comment-repository';
import { PostsRepository } from '../posts/repos/ports/posts-repository';
import { VotesSubscriptions } from './application/votes-subscriptions';

import { VotesController } from './votes-controller';
import { votesErrorHandler } from './votes-errors';
import { WebServer } from '../../shared/http';
import { Config } from '../../shared/config';
import { Database } from '@forumate/database';
import { EventBus } from '@forumate/bus';

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
