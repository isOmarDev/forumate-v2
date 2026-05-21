import {
  ITransactionalEmailApi,
  SendMailInput,
  SendMailResult,
} from '../../ports/transactional-email-api';

export class MailjetTransactionalEmailApi implements ITransactionalEmailApi {
  async sendMail(input: SendMailInput): Promise<SendMailResult> {
    console.log(
      `[MailJet] Sending email to ${input.to} with subject ${input.subject} and text ${input.text}`,
    );

    new Promise((resolve) => setTimeout(resolve, 500));

    return {
      messageId: `fake-${Date.now()}`,
      status: 'sent',
    };
  }
}
