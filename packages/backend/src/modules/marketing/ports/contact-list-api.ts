export interface IContactListApi {
  addEmailToList(email: string): Promise<string>;
}
