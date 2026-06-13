import { MarketingService } from './marketing-service';
import { MarketingController } from './marketing-controller';
import { MarketingErrors } from './marketing-errors';
import { IContactListApi } from './ports/contact-list-api';
import { MailchimpContactList } from './adapters/mailchimp-contact-list';
import { ContactListApiSpy } from './adapters/contact-list-api-spy';
import WebServer from '../../shared/server';
import { ApplicationModule } from '../../shared/modules/application-module';
import { Config } from '../../shared/config';

export class MarketingModule extends ApplicationModule {
  private contactListApi: IContactListApi;
  private marketingService: MarketingService;
  private marketingController: MarketingController;

  private constructor(config: Config) {
    super(config);
    this.contactListApi = this.createContactListApi();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
  }

  static build(config: Config) {
    return new MarketingModule(config);
  }

  private createContactListApi() {
    if (this.config.script === 'test:unit') {
      return new ContactListApiSpy();
    }
    return new MailchimpContactList();
  }

  private createMarketingService() {
    return new MarketingService(this.contactListApi);
  }

  private createMarketingController() {
    return new MarketingController(this.marketingService, MarketingErrors);
  }

  getContactListApi() {
    return this.contactListApi;
  }

  getMarketingService() {
    return this.marketingService;
  }

  getMarketingController() {
    return this.marketingController;
  }

  mountRouter(server: WebServer) {
    server.moutRouter('/marketing', this.marketingController.getRouter());
  }
}
