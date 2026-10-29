import { type IDatabase, Prisma } from '@forumate/database';
import { DatabaseError } from '@forumate/errors/server';

import { CommentVoteMap } from '../../application/mappers/comment-vote-map';
import type { ICommentVotesRepository } from '../../application/ports';
import { CommentVote } from '../../domain/entities/comment-vote';

export class PrismaCommentVotesRepository implements ICommentVotesRepository {
  constructor(private database: IDatabase) {}

  async findByMemberAndCommentId(
    memberId: string,
    commentId: string,
  ): Promise<CommentVote | null> {
    const connection = this.database.getClient();
    const vote = await connection.commentVote.findUnique({
      where: {
        memberId_commentId: {
          memberId,
          commentId,
        },
      },
    });

    if (!vote) return null;

    return CommentVoteMap.toDomain(vote);
  }

  async save(vote: CommentVote, transaction?: Prisma.TransactionClient) {
    const prismaInstance = transaction || this.database.getClient();

    const voteData = CommentVoteMap.toPersistence(vote);

    try {
      await prismaInstance.commentVote.upsert({
        where: {
          memberId_commentId: {
            memberId: voteData.memberId,
            commentId: voteData.commentId,
          },
        },
        update: voteData,
        create: voteData,
      });
    } catch (err) {
      console.log(err);
      throw new DatabaseError();
    }
  }
}
