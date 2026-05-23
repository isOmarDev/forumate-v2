import {
  ITransactionalEmailApi,
  SendMailInput,
  SendMailResult,
} from '../../ports/transactional-email-api';
import { Spy } from '../../../../shared/test-doubles/spy';

export class TransactionalEmailApiSpy
  extends Spy<ITransactionalEmailApi>
  implements ITransactionalEmailApi
{
  async sendMail(input: SendMailInput): Promise<SendMailResult> {
    console.log(
      `[TransactionEmailApiSpy] Sending email to ${input.to} with subject ${input.subject} and text ${input.text}`,
    );

    new Promise((resolve) => setTimeout(resolve, 500));

    this.addCall('sendMail', [input]);

    return {
      messageId: `fake-${Date.now()}`,
      status: 'sent',
    };
  }
}
