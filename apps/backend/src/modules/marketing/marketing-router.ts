import { BaseRouter } from '../../shared/infra/http';

import { type MarketingController } from './marketing-controller';

export class MarketingRouter extends BaseRouter {
  public readonly basePath: string = '/marketing';

  constructor(private controller: MarketingController) {
    super();
  }

  protected setupRoutes(): void {
    this.router.post('/', this.controller.addEmailToList);
  }
}
