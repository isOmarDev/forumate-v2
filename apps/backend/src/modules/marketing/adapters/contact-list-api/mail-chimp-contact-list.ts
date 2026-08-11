import { ContactListApi } from '../../ports/contact-list-api';

export class MailchimpContactList implements ContactListApi {
  async addEmailToList(email: string): Promise<boolean> {
    // Do the actual work
    console.log(
      `MailchimpContactList: Adding ${email} list... for production usage.`,
    );
    return true;
  }
}
