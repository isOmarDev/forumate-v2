export type DecodedIdToken = {
  email: string;
  uid: string;
};

export type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};
