import {
  AddEmailToListCommand,
  type EmailSubscriptionDto,
} from '@forumate/api/marketing';

import { type IContactListApi } from '../contact-list/ports/contact-list-api';

export class MarketingService {
  constructor(private contactListApi: IContactListApi) {}

  async addEmailToList(
    command: AddEmailToListCommand,
  ): Promise<EmailSubscriptionDto> {
    const result = await this.contactListApi.addEmailToList(command.email);
    return result;
  }
}
