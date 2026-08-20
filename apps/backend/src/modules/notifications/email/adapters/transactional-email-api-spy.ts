import { Spy } from '../../../../shared/test-doubles/spy';
import {
  SendMailInput,
  TransactionalEmailApi,
} from '../ports/transactional-email-api';

export class TransactionalEmailApiSpy
  extends Spy<TransactionalEmailApi>
  implements TransactionalEmailApi
{
  constructor() {
    super();
  }

  async sendMail(input: SendMailInput): Promise<boolean> {
    this.addCall('sendMail', [input]);
    return true;
  }
}
