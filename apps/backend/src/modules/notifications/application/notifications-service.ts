import { TransactionalEmailApi } from '../external-services/ports/transactional-email-api';
import { SendNotificationCommand } from '../notification-commands';

import { SendNotification } from './use-cases/send-notification/send-notification';

export class NotificationsService {
  private transactionalEmailApi: TransactionalEmailApi;

  constructor(transactionalEmailApi: TransactionalEmailApi) {
    this.transactionalEmailApi = transactionalEmailApi;
  }

  public sendNotification(command: SendNotificationCommand) {
    return new SendNotification(this.transactionalEmailApi).execute(command);
  }
}
