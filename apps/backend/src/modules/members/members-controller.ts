import express, { ErrorRequestHandler } from 'express';

import { CreateMemberCommand } from '@forumate/api';

import { Config } from '../../shared/config';

import { MemberService } from './application/members-service';

export class MembersController {
  private router: express.Router;

  constructor(
    private memberService: MemberService,
    private errorHandler: ErrorRequestHandler,
    private config: Config,
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post('/new', this.createMember.bind(this));
  }

  private async createMember(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const commandOrError = CreateMemberCommand.fromRequest(
        req.user,
        req.body,
      );
      if (!commandOrError.isSuccess) {
        return res.status(401).json({
          success: false,
          error: commandOrError.getError(),
        });
      }

      const result = await this.memberService.createMember(
        commandOrError.getValue(),
      );

      return result.match({
        success: (value) =>
          res.status(200).json({
            success: true,
            data: value,
            statusCode: 200,
            error: null,
          }),
        failure: (error) =>
          res.status(400).json({
            success: false,
            data: null,
            statusCode: 400,
            error,
          }),
      });
    } catch (err) {
      next(err);
    }
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }
}
