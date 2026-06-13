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
    if (this.config.script === 'test:unit') {
      return new TransactionalEmailApiSpy();
    }
    return new MailjetTransactionalEmailApi();
  }

  getTransactionalEmailApi() {
    return this.transactionalEmailApi;
  }
}
