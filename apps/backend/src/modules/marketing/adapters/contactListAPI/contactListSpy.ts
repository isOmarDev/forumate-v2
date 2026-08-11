import { ContactListApi } from '../../ports/contact-list-api';
import { Spy } from '../../../../shared/test-doubles/spy';

export class ContactListAPISpy
  extends Spy<ContactListApi>
  implements ContactListApi
{
  constructor() {
    super();
  }

  public async addEmailToList(email: string): Promise<boolean> {
    console.log(
      `ContactListAPISpy: Adding ${email} to list... this is for testing & development purposes.`,
    );
    this.addCall('addEmailToList', [email]);
    return true;
  }
}
