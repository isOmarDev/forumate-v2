import { type CommentModel, type IDatabase, Prisma } from '@forumate/database';
import { DatabaseError } from '@forumate/errors';

import { CommentMap } from '../../application/mappers/comment-map';
import type { ICommentsRepository } from '../../application/ports/comments-repository';
import { Comment } from '../../domain/entities/comment';

export class PrismaCommentsRepository implements ICommentsRepository {
  constructor(private database: IDatabase) {}

  async save(comment: Comment, transaction?: Prisma.TransactionClient) {
    const prismaInstance = transaction || this.database.getClient();

    const commentData = CommentMap.toPersistence(comment);

    try {
      await prismaInstance.comment.upsert({
        where: { id: commentData.id },
        update: commentData,
        create: commentData,
      });
    } catch (err) {
      console.log(err);
      throw new DatabaseError();
    }
  }

  async findById(id: string): Promise<Comment | null> {
    const connection = this.database.getClient();

    const comment = await connection.comment.findUnique({
      where: { id },
    });

    if (!comment) return null;

    return CommentMap.toDomain(comment);
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    const client = this.database.getClient();

    const comments = await client.comment.findMany({ where: { postId } });

    return comments.map((post: CommentModel) => CommentMap.toDomain(post));
  }
}
