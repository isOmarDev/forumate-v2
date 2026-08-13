import express from 'express';

import { AddEmailToListResponse } from '@forumate/api';

import { ErrorHandler } from '../../shared/errors';

import { MarketingService } from './application/marketing-service';

export class MarketingController {
  private router: express.Router;

  constructor(
    private marketingService: MarketingService,
    private errorHandler: ErrorHandler,
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post('/new', this.addEmailToList.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async addEmailToList(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const email = req.body.email;
      const result = await this.marketingService.addEmailToList(email);
      const response: AddEmailToListResponse = {
        data: result,
        success: true,
        error: null,
      };
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
