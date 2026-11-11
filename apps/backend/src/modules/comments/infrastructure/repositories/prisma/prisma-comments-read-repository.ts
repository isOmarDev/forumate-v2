import { type IDatabase, Prisma } from '@forumate/database';
import { DatabaseError } from '@forumate/errors';

import { CommentReadModelMap } from '../../../application/mappers/comment-read-model-map';
import type { ICommentsReadRepository } from '../../../application/ports/comments-read-repository';
import { CommentReadModel } from '../../../application/read-models/comment-read-model';

export class PrismaCommentsReadRepository implements ICommentsReadRepository {
  constructor(private database: IDatabase) {}

  async findById(commentId: string): Promise<CommentReadModel | null> {
    const client = this.database.getClient();

    const comment = await client.commentRead.findUnique({
      where: { id: commentId },
    });

    if (!comment) return null;

    return CommentReadModelMap.fromPersistence(comment);
  }

  async listByPostId(postId: string): Promise<CommentReadModel[]> {
    const client = this.database.getClient();

    const comments = await client.commentRead.findMany({
      where: { postId },
      orderBy: { postedAt: 'asc' },
    });

    return comments.map((comment) =>
      CommentReadModelMap.fromPersistence(comment),
    );
  }

  async save(
    commentReadModel: CommentReadModel,
    transaction?: Prisma.TransactionClient,
  ) {
    const prismaInstance = transaction || this.database.getClient();

    const commentData = CommentReadModelMap.toPersistence(commentReadModel);

    try {
      await prismaInstance.commentRead.upsert({
        where: { id: commentData.id },
        update: commentData,
        create: commentData,
      });
    } catch (err) {
      console.log(err);
      throw new DatabaseError();
    }
  }
}
