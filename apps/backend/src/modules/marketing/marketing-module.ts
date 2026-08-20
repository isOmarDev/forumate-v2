import { Config } from '../../shared/config';
import { WebServer } from '../../shared/http';
import { ApplicationModule } from '../../shared/modules/application-module';

import { MarketingService } from './application/marketing-service';
import { ContactListApiSpy } from './contact-list/adapters/contact-list-spy';
import { MailchimpContactList } from './contact-list/adapters/mail-chimp-contact-list';
import { ContactListApi } from './contact-list/ports/contact-list-api';
import { MarketingController } from './marketing-controller';
import { marketingErrorHandler } from './marketing-errors';

export class MarketingModule extends ApplicationModule {
  private marketingService: MarketingService;
  private marketingController: MarketingController;
  private contactListApi: ContactListApi;

  private constructor(config: Config) {
    super(config);
    this.contactListApi = this.buildContactListApi();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
  }

  static build(config: Config) {
    return new MarketingModule(config);
  }

  private createMarketingService() {
    return new MarketingService(this.contactListApi);
  }

  private createMarketingController() {
    return new MarketingController(
      this.marketingService,
      marketingErrorHandler,
    );
  }

  private buildContactListApi() {
    if (this.config.script === 'test:unit') {
      return new ContactListApiSpy();
    }
    return new MailchimpContactList();
  }

  public getMarketingController() {
    return this.marketingController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter('/marketing', this.marketingController.getRouter());
  }

  public getMarketingService() {
    return this.marketingService;
  }

  public getContactListApi() {
    return this.contactListApi;
  }
}
