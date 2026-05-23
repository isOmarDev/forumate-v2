import { IUserRepository } from '../ports/user-repository';
import { PrismaClient, User } from '../../../shared/database';
import { CreateUserInput } from '@dddforum/shared/api/users';

export class PrismaUserRepo implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(user: CreateUserInput): Promise<User> {
    const { email, username, firstName, lastName, password } = user;

    return await this.prisma.$transaction(async () => {
      const user = await this.prisma.user.create({
        data: { email, username, firstName, lastName, password },
      });
      await this.prisma.member.create({ data: { userId: user.id } });
      return user;
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findFirst({ where: { email } });
    return data;
  }

  async findByUsername(username: string): Promise<User | null> {
    const data = await this.prisma.user.findFirst({ where: { username } });
    return data;
  }

  async findAll(filters?: { email?: string }): Promise<User[]> {
    const data = await this.prisma.user.findMany({ where: filters });
    return data;
  }
}
