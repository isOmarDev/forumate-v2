import { GenericServerError } from '@forumate/errors/server';

import { ContactListApi } from '../contact-list/ports/contact-list-api';

export class MarketingService {
  constructor(private contactListApi: ContactListApi) {}

  async addEmailToList(email: string) {
    try {
      const result = await this.contactListApi.addEmailToList(email);
      return {
        subscription: result,
      };
    } catch (err) {
      throw new GenericServerError();
    }
  }
}
