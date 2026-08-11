import { PostsRepository } from '../ports/posts-repository';
import { Post } from '../../domain/post';
import { PostReadModel } from '../../domain/post-read-model';
import { MemberReadModel } from '../../../members/domain/member-read-model';
import {
  Database,
  Prisma,
  Post as PostModel,
  Member as MemberModel,
} from '@forumate/database';
import { DatabaseError } from '@forumate/errors/server';
import { GetPostsQuery } from '@forumate/api/posts';

type PostModelWithMember = PostModel & {
  memberPostedBy: MemberModel;
};

export class ProductionPostsRepository implements PostsRepository {
  constructor(private database: Database) {}

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

    return Post.toDomain(post);
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

  async save(
    post: Post,
    transaction?: Prisma.TransactionClient,
  ): Promise<void | DatabaseError> {
    const prismaInstance = transaction
      ? transaction
      : this.database.getClient();

    try {
      await prismaInstance.post.upsert({
        where: { id: post.id },
        update: {
          title: post.title,
          content: post.content,
          voteScore: post.voteScore,
          memberId: post.memberId,
          slug: post.slug,
        },
        create: {
          id: post.id,
          title: post.title,
          postType: post.postType,
          content: post.content,
          link: post.link,
          voteScore: post.voteScore,
          memberId: post.memberId,
          slug: post.slug,
        },
      });
    } catch (error) {
      console.log(error);
      throw new DatabaseError();
    }
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
