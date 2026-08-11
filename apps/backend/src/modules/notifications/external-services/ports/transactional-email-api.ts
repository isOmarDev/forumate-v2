export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
}

export interface TransactionalEmailApi {
  sendMail(input: SendMailInput): Promise<boolean>;
}
