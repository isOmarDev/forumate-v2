import {
  TransactionalEmailApiSpy,
  MailjetTransactionalEmailApi,
} from './adapters/transactional-email-api';
import { ITransactionalEmailApi } from './ports/transactional-email-api';
import { ApplicationModule } from '../../shared/modules/application-module';
import { Config } from '../../shared/config';

export class NotificationModule extends ApplicationModule {
  private transactionalEmailApi: ITransactionalEmailApi;

  private constructor(config: Config) {
    super(config);
    this.transactionalEmailApi = this.createTransactionalEmailApi();
  }

  static build(config: Config) {
    return new NotificationModule(config);
  }

  private createTransactionalEmailApi() {
    if (this.getEnvironment() === 'production') {
      return new MailjetTransactionalEmailApi();
    }

    return new TransactionalEmailApiSpy();
  }

  getTransactionalEmailApi() {
    return this.transactionalEmailApi;
  }
}
