import { EventBus } from '@forumate/bus';

import { Config } from '../../shared/config';
import { ApplicationModule } from '../../shared/modules/application-module';

import { NotificationsSubscriptions } from './application/notification-subscriptions';
import { NotificationsService } from './application/notifications-service';
import { MailjetTransactionalEmail } from './external-services/adapters/transactional-email-api/mailjet-transactional-email-api';
import { TransactionalEmailApiSpy } from './external-services/adapters/transactional-email-api/transactional-email-api-spy';
import { TransactionalEmailApi } from './external-services/ports/transactional-email-api';

export class NotificationsModule extends ApplicationModule {
  private transactionalEmailApi: TransactionalEmailApi;
  private notificationsService: NotificationsService;
  private notificationsSubscriptions: NotificationsSubscriptions;

  private constructor(
    private eventBus: EventBus,
    config: Config,
  ) {
    super(config);
    this.transactionalEmailApi = this.createTransactionalEmailApi();
    this.notificationsService = this.createNotificationsService();
    this.notificationsSubscriptions = this.createNotificationSubscriptions();
  }

  static build(eventBus: EventBus, config: Config) {
    return new NotificationsModule(eventBus, config);
  }

  private createNotificationSubscriptions() {
    return new NotificationsSubscriptions(
      this.eventBus,
      this.notificationsService,
    );
  }

  private createNotificationsService() {
    return new NotificationsService(this.transactionalEmailApi);
  }

  public getNotificationsService() {
    return this.notificationsService;
  }

  public getTransactionalEmailApi() {
    return this.transactionalEmailApi;
  }

  private createTransactionalEmailApi() {
    if (this.config.script === 'test:unit') {
      return new TransactionalEmailApiSpy();
    }
    return new MailjetTransactionalEmail();
  }
}
