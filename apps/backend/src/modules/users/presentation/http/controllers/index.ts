import { UserIdentityService } from '../../../application/user-identity-service';

import { CreateUserController } from './create-user-controller';

export class UsersController {
  constructor(private readonly userIdentityService: UserIdentityService) {}

  public createUser(): CreateUserController {
    return new CreateUserController(this.userIdentityService);
  }
}
