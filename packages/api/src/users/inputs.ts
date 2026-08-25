export type DecodedIdToken = {
  email: string;
  uid: string;
};

export type ValidatedUser = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

export type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};
