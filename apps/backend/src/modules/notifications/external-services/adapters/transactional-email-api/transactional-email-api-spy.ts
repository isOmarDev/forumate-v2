import { Spy } from '../../../../../shared/test-doubles/spy';
import {
  SendMailInput,
  TransactionalEmailAPI,
} from '../../ports/transactional-email-api';

export class TransactionalEmailAPISpy
  extends Spy<TransactionalEmailAPI>
  implements TransactionalEmailAPI
{
  constructor() {
    super();
  }

  async sendMail(input: SendMailInput): Promise<boolean> {
    this.addCall('sendMail', [input]);
    return true;
  }
}
