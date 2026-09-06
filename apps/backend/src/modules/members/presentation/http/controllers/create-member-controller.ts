import express from 'express';

import { CreateMemberCommand } from '@forumate/api/members';

import { BaseController } from '../../../../../shared/infra/http';
import { MembersService } from '../../../application/members-service';

export class CreateMemberController extends BaseController {
  constructor(private membersService: MembersService) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response) {
    const commandOrError = CreateMemberCommand.create(req.user);

    if (commandOrError.isFailure) {
      return this.fail(res, commandOrError.getError());
    }

    const resultOrError = await this.membersService.createMember(
      commandOrError.getValue(),
    );

    if (resultOrError.isFailure) {
      return this.fail(res, resultOrError.getError());
    }

    return this.created(res, resultOrError.getValue());
  }
}
