import { MarketingService } from '../../../application/marketing-service';

import { AddEmailToListController } from './add-email-to-list-controller';

export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  public addEmailToList(): AddEmailToListController {
    return new AddEmailToListController(this.marketingService);
  }
}
