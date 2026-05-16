import { IUserRepository } from '../ports/user-repository';
import { CreateUserCommand } from '../user-command';
import { PrismaClient, User } from '../../../shared/database';

export class PrismaUserRepo implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  public async create(user: CreateUserCommand): Promise<User> {
    const { email, username, firstName, lastName, password } = user;

    return await this.prisma.$transaction(async () => {
      const user = await this.prisma.user.create({
        data: { email, username, firstName, lastName, password },
      });
      await this.prisma.member.create({ data: { userId: user.id } });
      return user;
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findFirst({ where: { email } });
    return data;
  }

  public async findByUsername(username: string): Promise<User | null> {
    const data = await this.prisma.user.findFirst({ where: { username } });
    return data;
  }

  public async findAll(filters?: { email?: string }): Promise<User[]> {
    const data = await this.prisma.user.findMany({ where: filters });
    return data;
  }
}
