import { User } from '../../domain/user';
import { NotFoundError } from '@forumate/errors/application';

export interface IdentityServiceAPI {
  getUserById(userId: string): Promise<User | NotFoundError>;
  findUserByEmail(email: string): Promise<User | NotFoundError>;
}
