import { Spy } from '../../../../shared/test-doubles/spy';
import { ContactListApi } from '../../ports/contact-list-api';

export class ContactListApiSpy
  extends Spy<ContactListApi>
  implements ContactListApi
{
  constructor() {
    super();
  }

  public async addEmailToList(email: string): Promise<boolean> {
    console.log(
      `ContactListApiSpy: Adding ${email} to list... this is for testing & development purposes.`,
    );
    this.addCall('addEmailToList', [email]);
    return true;
  }
}
