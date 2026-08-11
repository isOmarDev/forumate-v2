import { SendNotificationCommand } from '../../../notification-commands';
import { TransactionalEmailApi } from '../../../external-services/ports/transactional-email-api';
import { Result, UseCase } from '@forumate/core';
import { NotFoundError } from '@forumate/errors/application';
import { AnyServerError } from '@forumate/errors/server';

type SendNotificationError = NotFoundError | AnyServerError;

export class SendNotification implements UseCase<
  SendNotificationCommand,
  Result<void, SendNotificationError>
> {
  constructor(transactionalEmailApi: TransactionalEmailApi) {}

  async execute(
    request: SendNotificationCommand,
  ): Promise<Result<void, SendNotificationError>> {
    // No need to implement. For demonstration purposes only. A mature approach would be to
    // queue a notification and process it later (see the RDD-First approach to event queuing).
    console.log('SendNotification -> Not yet implemented');
    return Result.success(undefined);
  }
}
