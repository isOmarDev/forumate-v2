export type AddEmailResult = {
  email: string;
};

export interface ContactListApi {
  addEmailToList(email: string): Promise<AddEmailResult>;
}
