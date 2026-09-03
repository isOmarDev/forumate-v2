import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';

import { UserIdentityService } from './application/user-identity-service';
import { FirebaseAuth } from './identity/adapters/firebase-auth';
import { type IIdentityServiceApi } from './identity/ports/identity-service-api';
import { UsersController } from './users-controller';
import { UsersRouter } from './users-router';

export class UsersModule extends ApplicationModule {
  private usersService: UserIdentityService;
  private identityServiceApi: IIdentityServiceApi;
  private usersController: UsersController;
  private usersRouter: UsersRouter;

  private constructor(config: Config) {
    super(config);

    this.identityServiceApi = this.createIdentityServiceApi(config);
    this.usersService = this.createUsersService();
    this.usersController = this.createUsersController();
    this.usersRouter = this.createUserRouter();

    this.setupRoutes();
  }
  static build(config: Config) {
    return new UsersModule(config);
  }

  private createIdentityServiceApi(config: Config) {
    return new FirebaseAuth();
  }

  private createUsersService() {
    return new UserIdentityService(this.identityServiceApi);
  }

  private createUsersController() {
    return new UsersController();
  }

  private createUserRouter() {
    return new UsersRouter(this.usersController);
  }

  private setupRoutes() {
    this.usersRouter.register();
  }

  public mountRouter(webServer: WebServer) {
    const path = this.usersRouter.basePath;
    const router = this.usersRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  public getUsersService() {
    return this.usersService;
  }
}
