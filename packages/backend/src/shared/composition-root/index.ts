import WebServer from '../server';
import { Database } from '../database/database';
import { Config } from '../config';
import GlobalErrorHandler from '../errors/global-error-handler';
import { UserModule } from '../../modules/user';
import { PostModule } from '../../modules/post';
import { MarketingModule } from '../../modules/marketing';
import { NotificationModule } from '../../modules/notification';

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;
  private webServer: WebServer;
  private db: Database;
  private userModule: UserModule;
  private postModule: PostModule;
  private marketingModule: MarketingModule;
  private notificationModule: NotificationModule;

  private constructor(private config: Config) {
    this.db = this.createDatabase();
    this.notificationModule = this.createNotificationModule();
    this.marketingModule = this.createMarketingModule();
    this.userModule = this.createUsersModule();
    this.postModule = this.createPostModule();
    this.webServer = this.createWebServer();
    this.mountRouters();
    this.registerGlobalErrorHandler();
  }

  static createCompositionRoot(config: Config) {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new CompositionRoot(config);
    }

    return CompositionRoot.instance;
  }

  private createWebServer() {
    return new WebServer({ port: 3000, env: this.config.env });
  }

  public getWebServer() {
    return this.webServer;
  }

  private createDatabase() {
    return new Database();
  }

  public getDatabase() {
    return this.db;
  }

  public getRepositories() {
    return {
      user: this.userModule.getUserRepository(),
      post: this.postModule.getPostRepository(),
    };
  }

  public getApplication() {
    return {
      user: this.userModule.getUserService(),
      post: this.postModule.getPostService(),
      marketing: this.marketingModule.getMarketingService(),
    };
  }

  private createUsersModule() {
    return UserModule.build(
      this.db,
      this.notificationModule.getTransactionalEmailApi(),
      this.config,
    );
  }

  private createPostModule() {
    return PostModule.build(this.db);
  }

  private createMarketingModule() {
    return MarketingModule.build();
  }

  private createNotificationModule() {
    return NotificationModule.build();
  }

  private mountRouters() {
    this.marketingModule.mountRouter(this.webServer);
    this.userModule.mountRouter(this.webServer);
    this.postModule.mountRouter(this.webServer);
  }

  private registerGlobalErrorHandler() {
    this.webServer.setupGlobalErrorHandler(GlobalErrorHandler.handle);
  }
}
