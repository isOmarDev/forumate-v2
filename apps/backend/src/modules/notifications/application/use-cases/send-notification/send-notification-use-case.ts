import { Result, type IUseCase } from '@forumate/core';
import { NotFoundError } from '@forumate/errors/application';

import { SendNotificationCommand } from '../../../notifications-commands';
import { ITransactionalEmailApi } from '../../ports/transactional-email-api';

export type SendNotificationResponse = Result<void, NotFoundError>;

export class SendNotificationUseCase implements IUseCase<
  SendNotificationCommand,
  SendNotificationResponse
> {
  constructor(private transactionalEmailApi: ITransactionalEmailApi) {}

  async execute(
    request: SendNotificationCommand,
  ): Promise<SendNotificationResponse> {
    // No need to implement. For demonstration purposes only. A mature approach would be to
    // queue a notification and process it later (see the RDD-First approach to event queuing).
    console.log('SendNotification -> Not yet implemented');
    return Result.success(undefined);
  }
}
