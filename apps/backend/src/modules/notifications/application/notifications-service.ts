import { SendNotificationCommand } from '../notifications-commands';

import { ITransactionalEmailApi } from './ports/transactional-email-api';
import { SendNotificationUseCase } from './use-cases/send-notification/send-notification-use-case';

export class NotificationsService {
  constructor(private transactionalEmailApi: ITransactionalEmailApi) {}

  public sendNotification(command: SendNotificationCommand) {
    return new SendNotificationUseCase(this.transactionalEmailApi).execute(
      command,
    );
  }
}
