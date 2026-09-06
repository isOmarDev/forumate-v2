import { Spy } from '../../../../shared/test-doubles/spy';
import {
  type SendMailInput,
  type ITransactionalEmailApi,
} from '../../application/ports/transactional-email-api';

export class TransactionalEmailApiSpy
  extends Spy<ITransactionalEmailApi>
  implements ITransactionalEmailApi
{
  constructor() {
    super();
  }

  async sendMail(input: SendMailInput): Promise<boolean> {
    this.addCall('sendMail', [input]);
    return true;
  }
}
