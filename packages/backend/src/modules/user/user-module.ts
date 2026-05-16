import { UserService } from './user-service';
import { UserController } from './user-controller';
import { UserErrors } from './user-errors';
import { PrismaUserRepo } from './adapters/prisma-user-repo';
import { IUserRepository } from './ports/user-repository';
import WebServer from '../../shared/server';
import { Database } from '../../shared/database';
import { ITransactionalEmailAPI } from '../notification/ports/transactional-email-api';

export class UserModule {
  private userRepo: IUserRepository;
  private userService: UserService;
  private userController: UserController;

  private constructor(
    private db: Database,
    private emailApi: ITransactionalEmailAPI,
  ) {
    this.userRepo = this.createUserRepo();
    this.userService = this.createUserService();
    this.userController = this.createUserController();
  }

  static build(db: Database, emailApi: ITransactionalEmailAPI) {
    return new UserModule(db, emailApi);
  }

  private createUserRepo() {
    return new PrismaUserRepo(this.db.getClient());
  }

  private createUserService() {
    return new UserService(this.userRepo, this.emailApi);
  }

  private createUserController() {
    return new UserController(this.userService, UserErrors);
  }

  public getUserController() {
    return this.userController;
  }

  public mountRouter(server: WebServer) {
    server.moutRouter('/users', this.userController.getRouter());
  }
}
