import { BaseRouter } from '../../../../../shared/infra/http';
import { UsersController } from '../controllers';

export class UsersRouter extends BaseRouter {
  public readonly basePath: string = '/users';

  constructor(private controller: UsersController) {
    super();
  }

  protected setupRoutes(): void {
    const createUser = this.controller.createUser();

    this.router.post('/', createUser.execute);
    // this.router.get('/', this.controller.getUserByEmail);
    // this.router.get('/', this.controller.getUserById);
    // this.router.get('/', this.controller.getUserDetailsByEmail);
  }
}
