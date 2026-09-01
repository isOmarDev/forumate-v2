import express from 'express';

import { CreateMemberCommand } from '@forumate/api';

import { BaseController } from '../../shared/infra/http';

import { MembersService } from './application/members-service';

export class MembersController extends BaseController {
  constructor(private memberService: MembersService) {
    super();
  }

  public createMember = async (req: express.Request, res: express.Response) => {
    const commandOrError = CreateMemberCommand.create(req.user);

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
