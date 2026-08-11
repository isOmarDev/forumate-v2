import { GenericServerError } from '@forumate/errors/server';
import { ContactListApi } from '../ports/contact-list-api';

export class MarketingService {
  constructor(private contactListAPI: ContactListApi) {}

  async addEmailToList(email: string) {
    try {
      const result = await this.contactListAPI.addEmailToList(email);
      return result;
    } catch (err) {
      throw new GenericServerError();
    }
  }
}
