import { GetPostsQuery } from '@forumate/api/posts';
import {
  type IDatabase,
  type MemberModel,
  type PostModel,
  Prisma,
} from '@forumate/database';
import { DatabaseError } from '@forumate/errors/server';

import { MemberReadModel } from '../../../members/application/read-models/member-read-model';
import { PostMap } from '../../application/mappers/post-map';
import type { IPostsRepository, IPostsQueries } from '../../application/ports';
import { PostReadModel } from '../../application/read-models/post-read-model';
import { Post } from '../../domain/entities/post';

type PostModelWithMember = PostModel & {
  memberPostedBy: MemberModel;
};

export class PrismaPostsRepository implements IPostsRepository, IPostsQueries {
  constructor(private database: IDatabase) {}

  async getPostById(id: string): Promise<Post | null> {
    const connection = this.database.getClient();
    const post = await connection.post.findUnique({
      where: { id },
      include: {
        memberPostedBy: true,
      },
    });

    if (!post) {
      return null;
    }

    return PostMap.toDomain(post);
  }

  async save(
    post: Post,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    const prismaInstance = transaction ?? this.database.getClient();

    const content = post.postType === 'text' ? post.content : null;
    const link = post.postType === 'link' ? post.link : null;

    try {
      await prismaInstance.post.upsert({
        where: { id: post.id },
        update: {
          memberId: post.memberId,
          title: post.title,
          content,
          link,
          voteScore: post.voteScore,
          slug: post.slug,
        },
        create: {
          id: post.id,
          memberId: post.memberId,
          title: post.title,
          content,
          link,
          postType: post.postType,
          voteScore: post.voteScore,
          slug: post.slug,
        },
      });
    } catch (error) {
      console.error(error);
      throw new DatabaseError();
    }
  }

  async findPosts(query: GetPostsQuery): Promise<PostReadModel[]> {
    const connection = this.database.getClient();
    const sqlQuery = {
      orderBy: {},
      include: {
        memberPostedBy: true,
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
      sqlQuery.orderBy = { dateCreated: 'desc' };
    }

    const posts = await connection.post.findMany(sqlQuery);

    return posts.map((post: PostModelWithMember) =>
      PostReadModel.fromPrismaToDomain(
        post,
        MemberReadModel.fromPrisma(post.memberPostedBy),
      ),
    );
  }

  public async getPostDetailsById(id: string): Promise<PostReadModel | null> {
    const connection = this.database.getClient();
    const post = await connection.post.findUnique({
      where: { id },
      include: {
        memberPostedBy: true,
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

    return PostReadModel.fromPrismaToDomain(
      { ...post, voteScore },
      MemberReadModel.fromPrisma(post.memberPostedBy),
    );
  }

  async getPostBySlug(slug: string): Promise<PostReadModel | null> {
    const connection = this.database.getClient();
    const post = await connection.post.findFirst({
      where: { slug },
      include: {
        memberPostedBy: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) return null;

    const member = MemberReadModel.fromPrisma(post.memberPostedBy);
    return PostReadModel.fromPrismaToDomain(post, member);
  }
}
