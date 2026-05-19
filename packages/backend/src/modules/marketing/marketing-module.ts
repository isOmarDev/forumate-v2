import { MarketingService } from './marketing-service';
import { MarketingController } from './marketing-controller';
import { MarketingErrors } from './marketing-errors';
import { IContactListApi } from './ports/contact-list-api';
import { MailchimpContactList } from './adapters/mailchimp-contact-list';
import WebServer from '../../shared/server';

export class MarketingModule {
  private contactListApi: IContactListApi;
  private marketingService: MarketingService;
  private marketingController: MarketingController;

  private constructor() {
    this.contactListApi = this.createContactListApi();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
  }

  static build() {
    return new MarketingModule();
  }

  private createContactListApi() {
    return new MailchimpContactList();
  }

  private createMarketingService() {
    return new MarketingService(this.contactListApi);
  }

  private createMarketingController() {
    return new MarketingController(this.marketingService, MarketingErrors);
  }

  public getMarketingController() {
    return this.marketingController;
  }

  public getMarketingService() {
    return this.marketingService;
  }

  public mountRouter(server: WebServer) {
    server.moutRouter('/marketing', this.marketingController.getRouter());
  }
}
