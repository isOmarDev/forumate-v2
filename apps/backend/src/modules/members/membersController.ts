import express from 'express';
import { MemberService } from './application/membersService';
import { ErrorRequestHandler } from 'express';
import { CreateMemberApiResponse, CreateMemberCommand } from '@forumate/api';
import { Config } from '@forumate/config';

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
      if (!commandOrError.isSuccess()) {
        return res.status(401).json({
          success: false,
          error: commandOrError.getError(),
        });
      }

      const result = await this.memberService.createMember(
        commandOrError.getValue(),
      );
      if (result.isSuccess()) {
        return res.status(200).json({
          success: true,
          data: result.getValue().toDTO(),
        } as CreateMemberApiResponse);
      } else {
        return res.status(400).json({
          data: null,
          success: false,
          error: result.getError(),
        } as CreateMemberApiResponse);
      }
    } catch (err) {
      next(err);
    }
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }
}
