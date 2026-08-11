import { ApplicationModule } from '../../shared/modules/application-module';
import { NotificationsService } from './application/notifications-service';
import { NotificationsSubscriptions } from './application/notification-subscriptions';
import { TransactionalEmailAPISpy } from './external-services/adapters/transactional-email-api/transactional-email-api-spy';
import { TransactionalEmailAPI } from './external-services/ports/transactional-email-api';
import { MailjetTransactionalEmail } from './external-services/adapters/transactional-email-api/mailjet-transactional-email-api';
import { Config } from '../../shared/config';
import { EventBus } from '@forumate/bus';

export class NotificationsModule extends ApplicationModule {
  private transactionalEmailAPI: TransactionalEmailAPI;
  private notificationsService: NotificationsService;
  private notificationsSubscriptions: NotificationsSubscriptions;

  private constructor(
    private eventBus: EventBus,
    config: Config,
  ) {
    super(config);
    this.transactionalEmailAPI = this.createTransactionalEmailAPI();
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
    return new NotificationsService(this.transactionalEmailAPI);
  }

  public getNotificationsService() {
    return this.notificationsService;
  }

  public getTransactionalEmailAPI() {
    return this.transactionalEmailAPI;
  }

  private createTransactionalEmailAPI() {
    if (this.config.script === 'test:unit') {
      return new TransactionalEmailAPISpy();
    }
    return new MailjetTransactionalEmail();
  }
}
