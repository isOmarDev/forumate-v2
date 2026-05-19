import { CreateUserCommand } from '../user-command';
import { IUserRepository } from '../ports/user-repository';
import { User } from '../../../shared/database';
import { CreateUserInput } from '@dddforum/shared/api/users';

export class InMemoryUserRepo implements IUserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  create(user: CreateUserInput): Promise<User> {
    const newUser = {
      ...user,
      id: this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1,
    };

    this.users.push(newUser);

    return Promise.resolve(newUser);
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email) ?? null;
    return Promise.resolve(user);
  }

  findByUsername(username: string): Promise<User | null> {
    const user = this.users.find((user) => user.username === username) ?? null;
    return Promise.resolve(user);
  }

  findAll(filters?: { email?: string }): Promise<User[]> {
    const users = this.users.filter((user) => {
      if (!filters) return true;
      return Object.entries(filters).every(
        ([key, value]) => user[key as keyof User] === value,
      );
    });

    return Promise.resolve(users);
  }

  async reset() {
    this.users = [];
  }
}
