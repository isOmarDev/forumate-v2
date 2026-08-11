import { ApplicationModule } from '../../shared/modules/application-module';

import { CommentRepository } from './repos/ports/comment-repository';
import { ProductionCommentsRepository } from './repos/adapters/production-comment-repository';
import { CommentsService } from './application/comments-service';
import { WebServer } from '../../shared/http';
import { CommentsController } from './comments-controller';
import { commentsErrorHandler } from './comments-errors';
import { PostsRepository } from '../posts/repos/ports/posts-repository';
import { ProductionPostsRepository } from '../posts/repos/adapters/production-posts-repository';
import { MembersRepository } from '../members/repos/ports/members-repository';
import { EventBus } from '@forumate/bus';
import { Database } from '@forumate/database';
import { Config } from '../../shared/config';

export class CommentsModule extends ApplicationModule {
  private commentsRepository: CommentRepository;
  private postsRepository: PostsRepository;
  private commentsService: CommentsService;
  private commentsController: CommentsController;

  private constructor(
    private db: Database,
    membersRepo: MembersRepository,
    eventBus: EventBus,
    config: Config,
  ) {
    super(config);
    this.commentsRepository = this.createCommentRepository();
    this.postsRepository = this.createPostsRepository();
    this.commentsService = this.createCommentsService(membersRepo, eventBus);
    this.commentsController = this.createCommentsController();
  }

  static build(
    db: Database,
    config: Config,
    membersRepo: MembersRepository,
    eventBus: EventBus,
  ) {
    return new CommentsModule(db, membersRepo, eventBus, config);
  }

  private createCommentRepository() {
    if (this.commentsRepository) return this.commentsRepository;
    return new ProductionCommentsRepository(this.db);
  }

  private createPostsRepository() {
    if (this.postsRepository) return this.postsRepository;
    return new ProductionPostsRepository(this.db);
  }

  private createCommentsService(
    membersRepo: MembersRepository,
    eventBus: EventBus,
  ) {
    return new CommentsService(
      this.commentsRepository,
      this.postsRepository,
      membersRepo,
      eventBus,
    );
  }

  private createCommentsController() {
    return new CommentsController(this.commentsService, commentsErrorHandler);
  }

  public getCommentsRepository() {
    return this.commentsRepository;
  }

  public getCommentsService() {
    return this.commentsService;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter('/', this.commentsController.getRouter());
  }
}
