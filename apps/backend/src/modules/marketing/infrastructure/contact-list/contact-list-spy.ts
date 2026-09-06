import { type EmailSubscriptionDto } from '@forumate/api/marketing';

import { Spy } from '../../../../shared/test-doubles/spy';
import type { IContactListApi } from '../../application/ports/contact-list-api';

export class ContactListApiSpy
  extends Spy<IContactListApi>
  implements IContactListApi
{
  constructor() {
    super();
  }

  public async addEmailToList(email: string): Promise<EmailSubscriptionDto> {
    console.log(
      `ContactListApiSpy: Adding ${email} to list... this is for testing & development purposes.`,
    );

    this.addCall('addEmailToList', [email]);

    return { email, subscribed: true };
  }
}
