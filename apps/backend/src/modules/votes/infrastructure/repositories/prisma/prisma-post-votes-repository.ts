import { type IDatabase, Prisma } from '@forumate/database';
import { DatabaseError } from '@forumate/errors/server';

import { PostVoteMap } from '../../../application/mappers/post-vote-map';
import type { IPostVotesRepository } from '../../../application/ports';
import { PostVote } from '../../../domain/entities/post-vote';

export class PrismaPostVotesRepository implements IPostVotesRepository {
  constructor(private database: IDatabase) {}

  async findByMemberAndPostId(
    memberId: string,
    postId: string,
  ): Promise<PostVote | null> {
    const connection = this.database.getClient();
    const vote = await connection.postVote.findUnique({
      where: {
        memberId_postId: {
          memberId,
          postId,
        },
      },
    });

    if (!vote) return null;

    return PostVoteMap.toDomain(vote);
  }
  public async save(vote: PostVote, transaction?: Prisma.TransactionClient) {
    const prismaInstance = transaction || this.database.getClient();

    const voteData = PostVoteMap.toPersistence(vote);

    try {
      await prismaInstance.postVote.upsert({
        where: {
          memberId_postId: {
            memberId: voteData.memberId,
            postId: voteData.postId,
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
