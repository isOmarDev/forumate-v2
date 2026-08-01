import { Post, PrismaClient } from '../../../shared/database';
import { IPostRepository } from '../ports/post-repository';

export class PrismaPostRepo implements IPostRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(filters?: {}): Promise<Post[]> {
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
