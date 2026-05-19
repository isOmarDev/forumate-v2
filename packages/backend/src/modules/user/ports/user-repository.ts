import { User } from '../../../shared/database';
import { CreateUserInput } from '@dddforum/shared/api/users';

export interface IUserRepository {
  create(user: CreateUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAll(filters?: { email?: string }): Promise<User[]>;
}
