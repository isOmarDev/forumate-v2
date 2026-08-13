import { NotFoundError } from '@forumate/errors/application';

import { User } from '../../domain/user';

export interface IdentityServiceApi {
  getUserById(userId: string): Promise<User | NotFoundError>;
  findUserByEmail(email: string): Promise<User | NotFoundError>;
}
