import { NotFoundError } from '@forumate/errors/application';

import { User } from '../../domain/entities/user';

export interface IIdentityServiceApi {
  getUserById(userId: string): Promise<User | NotFoundError>;
  findUserByEmail(email: string): Promise<User | NotFoundError>;
}
