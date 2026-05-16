import { IContactListApi } from '../ports/contact-list-api';

export class MailchimpContactList implements IContactListApi {
  public async addEmailToList(email: string): Promise<string> {
    console.log(`[Mailchimp] Adding ${email} to mailing list...`);

    await new Promise((resolve) => setTimeout(resolve, 200));

    return email;
  }
}
