import { type IDatabase, Prisma } from '@forumate/database';

import { type IMembersRepository } from '../../application/ports/members-repository';
import { Member } from '../../domain/entities/member';

export class PrismaMembersRepository implements IMembersRepository {
  constructor(private database: IDatabase) {}

  async getMemberByUserId(userId: string): Promise<Member | null> {
    const connection = this.database.getClient();
    const memberData = await connection.member.findUnique({
      where: { userId: userId },
    });

    if (!memberData) {
      return null;
    }

    return Member.toDomain(memberData);
  }

  async findUserByUsername(username: string): Promise<Member | null> {
    const connection = this.database.getClient();
    const memberData = await connection.member.findUnique({
      where: { username: username },
    });

    if (!memberData) {
      return null;
    }

    return Member.toDomain(memberData);
  }

  async getMemberById(memberId: string): Promise<Member | null> {
    const connection = this.database.getClient();
    const memberData = await connection.member.findUnique({
      where: { id: memberId },
    });

    if (!memberData) {
      return null;
    }

    return Member.toDomain(memberData);
  }

  async save(member: Member, transaction?: Prisma.TransactionClient) {
    const prismaInstance = transaction || this.database.getClient();

    const memberData = member.toPersistence();

    try {
      await prismaInstance.member.upsert({
        where: { id: memberData.id },
        update: memberData,
        create: memberData,
      });
    } catch (err) {
      console.log(err);
      throw new Error('Database exception', { cause: err });
    }
  }
}
