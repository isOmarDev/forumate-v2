import { TransactionalEmailAPI } from '../external-services/ports/transactional-email-api';
import { SendNotificationCommand } from '../notification-commands';
import { SendNotification } from './use-cases/send-notification/send-notification';

export class NotificationsService {
  private transactionalEmailAPI: TransactionalEmailAPI;

  constructor(transactionalEmailAPI: TransactionalEmailAPI) {
    this.transactionalEmailAPI = transactionalEmailAPI;
  }

  public sendNotification(command: SendNotificationCommand) {
    return new SendNotification(this.transactionalEmailAPI).execute(command);
  }
}
