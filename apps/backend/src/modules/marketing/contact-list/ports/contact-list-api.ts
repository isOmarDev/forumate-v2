import { type EmailSubscriptionDto } from '@forumate/api/marketing';

export interface IContactListApi {
  addEmailToList(email: string): Promise<EmailSubscriptionDto>;
}
