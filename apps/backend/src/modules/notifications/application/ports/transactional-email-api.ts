export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
}

export interface ITransactionalEmailApi {
  sendMail(input: SendMailInput): Promise<boolean>;
}
