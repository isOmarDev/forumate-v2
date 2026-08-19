import { EventBus } from '@forumate/bus';
import { Database, PrismaDatabase } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import { MembersRepository } from '../members/repos/ports/members-repository';

import { PostsService } from './application/posts-service';
import { PostsController } from './posts-controller';
import { postsErrorHandler } from './posts-errors';
import { ProductionPostsRepository } from './repos/adapters/production-posts-repository';
import { PostsRepository } from './repos/ports/posts-repository';

export class PostsModule extends ApplicationModule {
  private postsRepository: PostsRepository;
  private postsService: PostsService;
  private postsController: PostsController;

  private constructor(
    private db: Database,
    config: Config,
    private eventBus: EventBus,
    private membersRepository: MembersRepository,
  ) {
    super(config);
    this.postsRepository = this.createPostsRepository();
    this.postsService = this.createPostsService(membersRepository);
    this.postsController = this.createPostsController();
  }

  static build(
    db: PrismaDatabase,
    config: Config,
    eventBus: EventBus,
    membersRepository: MembersRepository,
  ) {
    return new PostsModule(db, config, eventBus, membersRepository);
  }

  private createPostsRepository() {
    if (this.postsRepository) return this.postsRepository;

    // if (this.shouldBuildFakeRepository) {
    //   return InMemoryPostsRepository.createWithSeedData();
    // }

    return new ProductionPostsRepository(this.db);
  }

  private createPostsService(membersRepository: MembersRepository) {
    return new PostsService(
      this.postsRepository,
      membersRepository,
      this.eventBus,
    );
  }

  private createPostsController() {
    return new PostsController(this.postsService, postsErrorHandler);
  }

  public getPostsController() {
    return this.postsController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter('/posts', this.postsController.getRouter());
  }

  public getPostsService() {
    return this.postsService;
  }

  public getPostsRepository() {
    return this.postsRepository;
  }
}
