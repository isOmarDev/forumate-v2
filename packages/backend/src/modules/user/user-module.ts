import { UserService } from './user-service';
import { UserController } from './user-controller';
import { UserErrors } from './user-errors';
import { UserRepo } from './adapters/user-repo';
import WebServer from '../../shared/server';
import { Database } from '../../shared/database';
import { IUserRepository } from './ports/user-repository';

export class UserModule {
  private userRepo: IUserRepository;
  private userService: UserService;
  private userController: UserController;

  private constructor(private db: Database) {
    this.userRepo = this.createUserRepo();
    this.userService = this.createUserService();
    this.userController = this.createUserController();
  }

  static build(db: Database) {
    return new UserModule(db);
  }

  private createUserRepo() {
    return new UserRepo(this.db.getClient());
  }

  private createUserService() {
    return new UserService(this.userRepo);
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
