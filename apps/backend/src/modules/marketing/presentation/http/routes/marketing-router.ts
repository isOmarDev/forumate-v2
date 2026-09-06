import { BaseRouter } from '../../../../../shared/infra/http';
import { MarketingController } from '../controllers';

export class MarketingRouter extends BaseRouter {
  public readonly basePath: string = '/marketing';

  constructor(private controller: MarketingController) {
    super();
  }

  protected setupRoutes(): void {
    const addEmailToList = this.controller.addEmailToList();

    this.router.post('/', addEmailToList.execute);
  }
}
