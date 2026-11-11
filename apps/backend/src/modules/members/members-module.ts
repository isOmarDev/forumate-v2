import { type IEventBus } from '@forumate/bus';
import { type IDatabase } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';

import { MembersService } from './application/members-service';
import type { IMembersRepository } from './application/ports/members-repository';
import { MembersSubscriptions } from './application/subscriptions/members-subscriptions';
import { InMemoryMembersRepository } from './infrastructure/repositories/in-memory';
import { PrismaMembersRepository } from './infrastructure/repositories/prisma';
import { MembersController } from './presentation/http/controllers';
import { MembersRouter } from './presentation/http/routes/members-router';

export class MembersModule extends ApplicationModule {
  private membersRepository: IMembersRepository;
  private membersService: MembersService;
  private membersSubscriptions: MembersSubscriptions;
  private membersController: MembersController;
  private membersRouter: MembersRouter;

  private constructor(
    private db: IDatabase,
    private eventBus: IEventBus,
    config: Config,
  ) {
    super(config);

    this.membersRepository = this.createMembersRepository();
    this.membersService = this.createMembersService();
    this.membersSubscriptions = this.createMembersSubscriptions();
    this.membersController = this.createMembersController();
    this.membersRouter = this.createMembersRouter();

    this.setupRoutes();
    this.setupSubscriptions();
  }

  public static build(db: IDatabase, eventBus: IEventBus, config: Config) {
    return new MembersModule(db, eventBus, config);
  }

  private createMembersRepository() {
    if (this.shouldBuildFakeRepository) {
      return new InMemoryMembersRepository();
    }

    return new PrismaMembersRepository(this.db);
  }

  private createMembersService() {
    return new MembersService(this.membersRepository, this.eventBus);
  }

  private createMembersSubscriptions() {
    return new MembersSubscriptions(this.eventBus, this.membersService);
  }

  private createMembersController() {
    return new MembersController(this.membersService);
  }

  private createMembersRouter() {
    return new MembersRouter(this.membersController);
  }

  // ---- Setup ----

  private setupSubscriptions(): void {
    this.membersSubscriptions.register();
  }

  private setupRoutes() {
    this.membersRouter.register();
  }

  public mountRouter(webServer: WebServer) {
    const path = this.membersRouter.basePath;
    const router = this.membersRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  // ---- Public accessors ----

  public getMembersRepository() {
    return this.membersRepository;
  }

  public getMembersService() {
    return this.membersService;
  }

  public getMembersControllers() {
    return this.membersController;
  }
}
