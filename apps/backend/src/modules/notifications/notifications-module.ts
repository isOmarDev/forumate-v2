import { type IEventBus } from '@forumate/bus';

import { Config } from '../../shared/config';
import { ApplicationModule } from '../../shared/modules/application-module';

import { NotificationsService } from './application/notifications-service';
import { NotificationsSubscriptions } from './application/subscriptions/notification-subscriptions';
import { MailjetTransactionalEmail } from './email/adapters/mailjet-transactional-email-api';
import { TransactionalEmailApiSpy } from './email/adapters/transactional-email-api-spy';
import { type ITransactionalEmailApi } from './email/ports/transactional-email-api';

export class NotificationsModule extends ApplicationModule {
  private transactionalEmailApi: ITransactionalEmailApi;
  private notificationsService: NotificationsService;
  private notificationsSubscriptions: NotificationsSubscriptions;

  private constructor(
    private eventBus: IEventBus,
    config: Config,
  ) {
    super(config);
    this.transactionalEmailApi = this.createTransactionalEmailApi();
    this.notificationsService = this.createNotificationsService();
    this.notificationsSubscriptions = this.createNotificationSubscriptions();
  }

  static build(eventBus: IEventBus, config: Config) {
    return new NotificationsModule(eventBus, config);
  }

  private createTransactionalEmailApi() {
    if (this.config.script === 'test:unit') {
      return new TransactionalEmailApiSpy();
    }
    return new MailjetTransactionalEmail();
  }

  private createNotificationsService() {
    return new NotificationsService(this.transactionalEmailApi);
  }

  private createNotificationSubscriptions() {
    return new NotificationsSubscriptions(
      this.eventBus,
      this.notificationsService,
    );
  }

  public getTransactionalEmailApi() {
    return this.transactionalEmailApi;
  }

  public getNotificationsService() {
    return this.notificationsService;
  }
}
