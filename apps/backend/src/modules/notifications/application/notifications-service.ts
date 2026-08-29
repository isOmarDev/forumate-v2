import { ITransactionalEmailApi } from '../email/ports/transactional-email-api';
import { SendNotificationCommand } from '../notification-commands';

import { SendNotification } from './use-cases/send-notification/send-notification';

export class NotificationsService {
  constructor(private transactionalEmailApi: ITransactionalEmailApi) {}

  public sendNotification(command: SendNotificationCommand) {
    return new SendNotification(this.transactionalEmailApi).execute(command);
  }
}
