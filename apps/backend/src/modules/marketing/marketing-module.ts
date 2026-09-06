import { Config } from '../../shared/config';
import { WebServer } from '../../shared/infra/http';
import { ApplicationModule } from '../../shared/modules/application-module';

import { MarketingService } from './application/marketing-service';
import { IContactListApi } from './application/ports/contact-list-api';
import { ContactListApiSpy } from './infrastructure/contact-list/contact-list-spy';
import { MailchimpContactList } from './infrastructure/contact-list/mail-chimp-contact-list';
import { MarketingController } from './presentation/http/controllers';
import { MarketingRouter } from './presentation/http/routes/marketing-router';

export class MarketingModule extends ApplicationModule {
  private contactListApi: IContactListApi;
  private marketingService: MarketingService;
  private marketingController: MarketingController;
  private marketingRouter: MarketingRouter;

  private constructor(config: Config) {
    super(config);

    this.contactListApi = this.createContactListApi();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
    this.marketingRouter = this.createMarketingRouter();

    this.setupRoutes();
  }

  static build(config: Config) {
    return new MarketingModule(config);
  }

  private createContactListApi() {
    if (this.shouldBuildFakeRepository) {
      return new ContactListApiSpy();
    }
    return new MailchimpContactList();
  }

  private createMarketingService() {
    return new MarketingService(this.contactListApi);
  }

  private createMarketingController() {
    return new MarketingController(this.marketingService);
  }

  private createMarketingRouter() {
    return new MarketingRouter(this.marketingController);
  }

  public mountRouter(webServer: WebServer) {
    const path = this.marketingRouter.basePath;
    const router = this.marketingRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  private setupRoutes() {
    this.marketingRouter.register();
  }

  public getContactListApi() {
    return this.contactListApi;
  }

  public getMarketingService() {
    return this.marketingService;
  }

  public getMarketingControllers() {
    return this.marketingController;
  }
}
