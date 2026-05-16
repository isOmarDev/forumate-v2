import { MailjetTransactionalEmailAPI } from './adapters/transactional-email-api';
import { ITransactionalEmailAPI } from './ports/transactional-email-api';

export class NotificationModule {
  private transactionalEmailApi: ITransactionalEmailAPI;

  private constructor() {
    this.transactionalEmailApi = this.createTransactionalEmailApi();
  }

  static build() {
    return new NotificationModule();
  }

  public getTransactionalEmailApi() {
    return this.transactionalEmailApi;
  }

  private createTransactionalEmailApi() {
    return new MailjetTransactionalEmailAPI();
  }
}
