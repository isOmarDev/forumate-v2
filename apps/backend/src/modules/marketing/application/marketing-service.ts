import {
  AddEmailToListCommand,
  type EmailSubscriptionDto,
} from '@forumate/api/marketing';

import { type IContactListApi } from './ports/contact-list-api';
import { AddEmailToListUseCase } from './use-cases/add-email-to-list/add-email-to-list-use-case';

export class MarketingService {
  constructor(private contactListApi: IContactListApi) {}

  async addEmailToList(
    command: AddEmailToListCommand,
  ): Promise<EmailSubscriptionDto> {
    return new AddEmailToListUseCase(this.contactListApi).execute(command);
  }
}
