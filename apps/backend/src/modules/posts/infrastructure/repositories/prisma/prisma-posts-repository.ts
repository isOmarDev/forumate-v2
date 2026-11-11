import { GetPostsQuery } from '@forumate/api/posts';
import {
  type IDatabase,
  type MemberModel,
  type PostModel,
  Prisma,
} from '@forumate/database';
import { DatabaseError } from '@forumate/errors/server';

import { MemberReadModel } from '../../../../members/application/read-models/member-read-model';
import { PostMap } from '../../../application/mappers/post-map';
import type {
  IPostsRepository,
  IPostsReadRepository,
} from '../../../application/ports';
import { PostReadModel } from '../../../application/read-models/post-read-model';
import { Post } from '../../../domain/entities/post';

type PostModelWithMember = PostModel & {
  member: MemberModel;
};

export class PrismaPostsRepository
  implements IPostsRepository, IPostsReadRepository
{
  constructor(private database: IDatabase) {}

  public async findById(id: string): Promise<Post | null> {
    const connection = this.database.getClient();
    const post = await connection.post.findUnique({
      where: { id },
      include: { member: true },
    });

    if (!post) {
      return null;
    }

    return PostMap.toDomain(post);
  }

  public async findAuthorId(postId: string) {
    const row = await this.database.getClient().post.findUnique({
      where: { id: postId },
      select: { memberId: true },
    });
    return row?.memberId ?? null;
  }

  public async save(
    post: Post,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    const prismaInstance = transaction ?? this.database.getClient();
    const postData = PostMap.toPersistence(post);
    const { id, ...updateData } = postData;

    try {
      await prismaInstance.post.upsert({
        where: { id },
        update: updateData,
        create: postData,
      });
    } catch (error) {
      console.error(error);
      throw new DatabaseError();
    }
  }

  public async findPosts(query: GetPostsQuery): Promise<PostReadModel[]> {
    const connection = this.database.getClient();
    const sqlQuery = {
      orderBy: {},
      include: {
        member: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    };

    if (query.sort === 'popular') {
      sqlQuery.orderBy = { voteScore: 'desc' };
    }

    if (query.sort === 'recent') {
      sqlQuery.orderBy = { createdAt: 'desc' };
    }

    const posts = await connection.post.findMany(sqlQuery);

    return posts.map((post: PostModelWithMember) =>
      PostReadModel.fromPersistence(
        post,
        MemberReadModel.fromPrisma(post.member),
      ),
    );
  }

  public async findDetailsById(id: string): Promise<PostReadModel | null> {
    const connection = this.database.getClient();
    const post = await connection.post.findUnique({
      where: { id },
      include: {
        member: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    const voteScore = await connection.postVote
      .aggregate({
        _sum: { value: true },
        where: { postId: id },
      })
      .then((result) => result._sum.value || 0);

    return PostReadModel.fromPersistence(
      { ...post, voteScore },
      MemberReadModel.fromPrisma(post.member),
    );
  }

  public async findBySlug(slug: string): Promise<PostReadModel | null> {
    const connection = this.database.getClient();
    const post = await connection.post.findFirst({
      where: { slug },
      include: {
        member: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) return null;

    const member = MemberReadModel.fromPrisma(post.member);
    return PostReadModel.fromPersistence(post, member);
  }

  public async updateVoteScore(
    postId: string,
    scoreChange: number,
  ): Promise<void> {
    const client = this.database.getClient();

    await client.post.update({
      where: { id: postId },
      data: { voteScore: { increment: scoreChange } },
    });
  }
}
