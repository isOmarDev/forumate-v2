import { type IEventBus } from '@forumate/bus';
import { type IDatabase } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';

import { MembersService } from './application/members-service';
import { MembersController } from './members-controller';
import { MembersRouter } from './members-routers';
import { ProductionMembersRepository } from './repos/adapters/production-members-repository';
import { type IMembersRepository } from './repos/ports/members-repository';

export class MembersModule extends ApplicationModule {
  private membersRepository: IMembersRepository;
  private membersService: MembersService;
  private membersController: MembersController;
  private membersRouter: MembersRouter;

  private constructor(
    db: IDatabase,
    private eventBus: IEventBus,
    config: Config,
  ) {
    super(config);
    // Create the tree in reverse (repos, services, controllers)
    this.membersRepository = this.createMembersRepository(db);
    this.membersService = this.createMembersService();
    this.membersController = this.createMembersController(config);
    this.membersRouter = this.createMembersRouter();

    this.setupRoutes();
  }

  public static build(db: IDatabase, eventBus: IEventBus, config: Config) {
    return new MembersModule(db, eventBus, config);
  }

  private createMembersRepository(db: IDatabase) {
    return new ProductionMembersRepository(db);
  }

  private createMembersService() {
    return new MembersService(this.membersRepository, this.eventBus);
  }

  private createMembersController(config: Config) {
    return new MembersController(this.membersService, config);
  }

  private createMembersRouter() {
    return new MembersRouter(this.membersController);
  }

  private setupRoutes() {
    this.membersRouter.register();
  }

  public mountRouter(webServer: WebServer) {
    const path = this.membersRouter.basePath;
    const router = this.membersRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  public getMembersRepository() {
    return this.membersRepository;
  }

  public getMembersService() {
    return this.membersService;
  }

  public getMembersController() {
    return this.membersController;
  }
}
