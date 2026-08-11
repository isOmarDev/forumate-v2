import { WebServer } from '../../shared/http';
import { ApplicationModule } from '../../shared/modules/application-module';
import { ContactListApiSpy } from './adapters/contact-list-api/contact-list-spy';
import { MailchimpContactList } from './adapters/contact-list-api/mail-chimp-contact-list';
import { MarketingController } from './marketing-controller';
import { marketingErrorHandler } from './marketing-errors';
import { MarketingService } from './application/marketing-service';
import { ContactListApi } from './ports/contact-list-api';
import { Config } from '../../shared/config';

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
