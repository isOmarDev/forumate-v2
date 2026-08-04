import { Post, PrismaClient } from '@forumate/database';
import { IPostRepository } from '../ports/post-repository';

export class PrismaPostRepo implements IPostRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(filters?: object): Promise<Post[]> {
    const data = await this.prisma.post.findMany({
      where: filters,
      include: {
        votes: true,
        comments: true,
        memberPostedBy: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { dateCreated: 'desc' },
    });
    return data;
  }
}
