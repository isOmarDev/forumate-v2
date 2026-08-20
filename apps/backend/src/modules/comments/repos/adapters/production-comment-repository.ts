import { Database, Prisma } from '@forumate/database';

import { Comment } from '../../domain/entities/comment';
import { CommentRepository } from '../ports/comment-repository';

export class ProductionCommentsRepository implements CommentRepository {
  constructor(private database: Database) {}

  async save(comment: Comment, transaction?: Prisma.TransactionClient) {
    const prismaInstance = transaction || this.database.getClient();

    const commentData = comment.toPersistence();

    try {
      await prismaInstance.comment.upsert({
        where: { id: commentData.id },
        update: commentData,
        create: commentData,
      });
    } catch (err) {
      console.log(err);
      throw new Error('Database exception', { cause: err });
    }
  }

  async getCommentById(id: string): Promise<Comment | null> {
    const connection = this.database.getClient();

    const comment = await connection.comment.findUnique({
      where: { id },
    });

    if (!comment) return null;

    return Comment.toDomain(comment);
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return [];
  }
}
