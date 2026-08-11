export interface ContactListApi {
  addEmailToList(email: string): Promise<boolean>;
}
