import { Router } from 'express';
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

import { CreateUserCommand, CreateUserResponse, UserDTO } from '@forumate/api';
import { Config } from '../../shared/config';

export class UsersController {
  private router: Router;

  constructor(
    config: Config,
    private errorHandler: ErrorRequestHandler,
  ) {
    this.router = Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post('/new', this.createUser.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  /**
   * Note: For temporary purposes to simplify Pattern-First frontend teachings.
   */

  private async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const command = CreateUserCommand.fromRequest(req.body);
      if (!command.isSuccess()) {
        return next(command.getError());
      }

      const commandValue = command.getValue();
      const temporaryUserResponseDTO: UserDTO = {
        id: randomUUID(),
        email: commandValue.email,
        firstName: commandValue.firstName,
        lastName: commandValue.lastName,
        username: commandValue.username,
      };

      const response: CreateUserResponse = {
        data: temporaryUserResponseDTO,
        success: true,
        error: null,
      };
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
