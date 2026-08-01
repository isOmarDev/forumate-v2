import { IContactListApi } from '../ports/contact-list-api';
import { Spy } from '../../../shared/test-doubles/spy';

export class ContactListApiSpy
  extends Spy<IContactListApi>
  implements IContactListApi
{
  constructor() {
    super();
  }

  async addEmailToList(email: string): Promise<string> {
    console.log(`[ContactListApiSpy] Adding ${email} to mailing list...`);

    await new Promise((resolve) => setTimeout(resolve, 200));

    this.addCall('addEmailToList', [email]);

    return email;
  }
}
