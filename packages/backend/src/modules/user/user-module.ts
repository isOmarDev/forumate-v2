import { UserService } from './user-service';
import { UserController } from './user-controller';
import { UserErrors } from './user-errors';
import { PrismaUserRepo } from './adapters/prisma-user-repo';
import { InMemoryUserRepo } from './adapters/in-memory-user-repo';
import { IUserRepository } from './ports/user-repository';
import { ITransactionalEmailAPI } from '../notification/ports/transactional-email-api';
import WebServer from '../../shared/server';
import { Database } from '../../shared/database';
import { Config } from '../../shared/config';
import { ApplicationModule } from '../../shared/modules/application-module';

export class UserModule extends ApplicationModule {
  private userRepo: IUserRepository;
  private userService: UserService;
  private userController: UserController;

  private constructor(
    private db: Database,
    private emailApi: ITransactionalEmailAPI,
    config: Config,
  ) {
    super(config);
    this.userRepo = this.createUserRepo();
    this.userService = this.createUserService();
    this.userController = this.createUserController();
  }

  static build(db: Database, emailApi: ITransactionalEmailAPI, config: Config) {
    return new UserModule(db, emailApi, config);
  }

  private createUserRepo() {
    if (this.shoudBuildFakeRepository) {
      return new InMemoryUserRepo();
    }

    return new PrismaUserRepo(this.db.getClient());
  }

  private createUserService() {
    return new UserService(this.userRepo, this.emailApi);
  }

  private createUserController() {
    return new UserController(this.userService, UserErrors);
  }

  public getUserRepository() {
    return this.userRepo;
  }

  public getUserService() {
    return this.userService;
  }

  public getUserController() {
    return this.userController;
  }

  public mountRouter(server: WebServer) {
    server.moutRouter('/users', this.userController.getRouter());
  }
}
