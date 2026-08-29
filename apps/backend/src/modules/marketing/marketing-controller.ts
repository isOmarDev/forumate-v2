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
    const commandOrError = AddEmailToListCommand.fromRequest(req.body);
    // Temporary until real service is used
    const resultOrError =
      await this.marketingService.addEmailToList(commandOrError);
    this.created(res, { subscription: resultOrError });
  };
}
