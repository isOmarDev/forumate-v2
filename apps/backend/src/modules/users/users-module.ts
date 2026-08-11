import { UserIdentityService } from './application/user-identity-service';
import { ApplicationModule } from '../../shared/modules/application-module';
import { IdentityServiceApi } from './external-services/ports/identity-service-api';

import { WebServer } from '../../shared/http';
import { UsersController } from './users-controller';
import { userErrorHandler } from './users-errors'; // You'll need to create this
import { FirebaseAuth } from './external-services/adapters/firebase-auth';
import { Config } from '../../shared/config';

export class UsersModule extends ApplicationModule {
  private usersService: UserIdentityService;
  private identityServiceApi: IdentityServiceApi;
  private usersController: UsersController;

  private constructor(config: Config) {
    super(config);
    // Build external services + repos, then services, then controllers
    this.identityServiceApi = this.createIdentityServiceApi(config);
    this.usersService = this.createUsersService();
    this.usersController = this.createUsersController(config);
  }

  private createIdentityServiceApi(config: Config) {
    return new FirebaseAuth();
  }

  private createUsersService() {
    return new UserIdentityService(this.identityServiceApi);
  }

  private createUsersController(config: Config) {
    return new UsersController(config, userErrorHandler);
  }

  static build(config: Config) {
    return new UsersModule(config);
  }

  public getUsersService() {
    return this.usersService;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter('/users', this.usersController.getRouter());
  }
}
