import express from 'express';

import { AddEmailToListCommand } from '@forumate/api';

import { BaseController } from '../../shared/infra/http';

import { MarketingService } from './application/marketing-service';

export class MarketingController extends BaseController {
  constructor(private marketingService: MarketingService) {
    super();
  }

  public addEmailToList = async (
    req: express.Request,
    res: express.Response,
  ) => {
    const commandOrError = AddEmailToListCommand.create(req.body);

    if (commandOrError.isFailure) {
      return this.fail(res, commandOrError.getError());
    }

    // Temporary until real service is used
    const resultOrError = await this.marketingService.addEmailToList(
      commandOrError.getValue(),
    );

    this.created(res, { subscription: resultOrError });
  };
}
