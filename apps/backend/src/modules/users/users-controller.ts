import { randomUUID } from 'node:crypto';

import express from 'express';

import { CreateUserCommand, UserDto } from '@forumate/api/users';

import { BaseController } from '../../shared/infra/http';

export class UsersController extends BaseController {
  constructor() {
    super();
  }

  /**
   * Note: For temporary purposes to simplify Pattern-First frontend teachings.
   */

  public createUser = async (req: express.Request, res: express.Response) => {
    const commandOrError = CreateUserCommand.create(req.body);

    if (commandOrError.isFailure) {
      return this.fail(res, commandOrError.getError());
    }

    const user = commandOrError.getValue().props;

    const temporaryUserResponseDTO: UserDto = {
      id: randomUUID(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    };

    return this.created(res, temporaryUserResponseDTO);
  };
}
