import { PrismaClient } from '../../shared/database';

export class MemberRepo {
  constructor(private prisma: PrismaClient) {}

  async create(userId: number) {
    const data = await this.prisma.member.create({ data: { userId } });
    return data;
  }
}
