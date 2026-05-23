export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
}

export interface SendMailResult {
  messageId: string;
  status: 'sent' | 'queued' | 'failed';
}

export interface ITransactionalEmailApi {
  sendMail(input: SendMailInput): Promise<SendMailResult>;
}
