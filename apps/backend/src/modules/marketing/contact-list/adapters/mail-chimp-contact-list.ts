import { type EmailSubscriptionDto } from '@forumate/api/marketing';

import { type IContactListApi } from '../ports/contact-list-api';

export class MailchimpContactList implements IContactListApi {
  async addEmailToList(email: string): Promise<EmailSubscriptionDto> {
    // Do the actual work
    console.log(
      `MailchimpContactList: Adding ${email} list... for production usage.`,
    );

    return { email, subscribed: true };
  }
}
