import {
  ITransactionalEmailAPI,
  SendMailInput,
  SendMailResult,
} from '../../ports/transactional-email-api';

export class MailjetTransactionalEmailAPI implements ITransactionalEmailAPI {
  async sendMail(input: SendMailInput): Promise<SendMailResult> {
    console.log(
      `Sending email to ${input.to} with subject ${input.subject} and text ${input.text}`,
    );

    new Promise((resolve) => setTimeout(resolve, 500));

    return {
      messageId: `fake-${Date.now()}`,
      status: 'sent',
    };
  }
}
