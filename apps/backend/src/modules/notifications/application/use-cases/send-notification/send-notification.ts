import { Result, type IUseCase } from '@forumate/core';
import { NotFoundError } from '@forumate/errors/application';

import { ITransactionalEmailApi } from '../../../email/ports/transactional-email-api';
import { SendNotificationCommand } from '../../../notification-commands';

type SendNotificationError = NotFoundError;

export class SendNotification implements IUseCase<
  SendNotificationCommand,
  Result<void, SendNotificationError>
> {
  constructor(private transactionalEmailApi: ITransactionalEmailApi) {}

  async execute(
    request: SendNotificationCommand,
  ): Promise<Result<void, SendNotificationError>> {
    // No need to implement. For demonstration purposes only. A mature approach would be to
    // queue a notification and process it later (see the RDD-First approach to event queuing).
    console.log('SendNotification -> Not yet implemented');
    return Result.success(undefined);
  }
}
