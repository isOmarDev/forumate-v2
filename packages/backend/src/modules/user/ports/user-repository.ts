import { User } from '../../../shared/database';
import { CreateUserCommand } from '../user-command';

export interface IUserRepository {
  create(user: CreateUserCommand): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAll(filters?: { email?: string }): Promise<User[]>;
}
