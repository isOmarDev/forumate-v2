import { AddEmailToListCommand, EmailSubscriptionDto } from '@forumate/api';
import { type IUseCase } from '@forumate/core';

import { IContactListApi } from '../../ports/contact-list-api';

export class AddEmailToListUseCase implements IUseCase<
  AddEmailToListCommand,
  EmailSubscriptionDto
> {
  constructor(private contactListApi: IContactListApi) {}

  async execute(command: AddEmailToListCommand): Promise<EmailSubscriptionDto> {
    const result = await this.contactListApi.addEmailToList(command.email);
    return result;
  }
}
