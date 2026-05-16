import { AddEmailToListDTO } from './marketing-dto';
import { EmailNotAddedToMailListException } from './marketing-exceptions';
import { IContactListApi } from './ports/contact-list-api';

export class MarketingService {
  constructor(private contactListAPI: IContactListApi) {}

  public async addEmailToList(dto: AddEmailToListDTO) {
    const { email } = dto;

    const result = this.contactListAPI.addEmailToList(email);

    if (!result) {
      throw new EmailNotAddedToMailListException(email);
    }

    return result;
  }
}
