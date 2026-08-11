import { WebServer } from '../../shared/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import { ContactListAPISpy } from './adapters/contact-list-api/contact-list-spy';
import { MailchimpContactList } from './adapters/contact-list-api/mail-chimp-contact-list';
import { MarketingController } from './marketing-controller';
import { marketingErrorHandler } from './marketing-errors';
import { MarketingService } from './application/marketing-service';
import { ContactListApi } from './ports/contact-list-api';
import { Config } from '../../shared/config';

export class MarketingModule extends ApplicationModule {
  private marketingService: MarketingService;
  private marketingController: MarketingController;
  private contactListAPI: ContactListApi;

  private constructor(config: Config) {
    super(config);
    this.contactListAPI = this.buildContactListAPI();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
  }

  static build(config: Config) {
    return new MarketingModule(config);
  }

  private createMarketingService() {
    return new MarketingService(this.contactListAPI);
  }

  private createMarketingController() {
    return new MarketingController(
      this.marketingService,
      marketingErrorHandler,
    );
  }

  private buildContactListAPI() {
    if (this.config.script === 'test:unit') {
      return new ContactListAPISpy();
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

  public getContactListAPI() {
    return this.contactListAPI;
  }
}
