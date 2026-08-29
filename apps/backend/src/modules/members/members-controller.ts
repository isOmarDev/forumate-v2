import express from 'express';

import { CreateMemberCommand } from '@forumate/api';

import { Config } from '../../shared/config';
import { BaseController } from '../../shared/infra/http';

import { MembersService } from './application/members-service';

export class MembersController extends BaseController {
  constructor(
    private memberService: MembersService,
    private config: Config,
  ) {
    super();
  }

  public createMember = async (req: express.Request, res: express.Response) => {
    const commandOrError = CreateMemberCommand.fromRequest(req.user, req.body);

    if (commandOrError.isFailure) {
      return this.fail(res, commandOrError.getError());
    }

    const resultOrError = await this.memberService.createMember(
      commandOrError.getValue(),
    );

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    return this.created(res, resultOrError.getValue());
  };
}
