import { type IDatabase } from '@forumate/database';

import { PostVoteMap } from '../../application/mappers/post-vote-map';
import type { IPostVotesRepository } from '../../application/ports';
import { PostVote } from '../../domain/entities/post-vote';

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

  async save(vote: PostVote) {
    // implement
    throw new Error('Not yet implemented');
  }
}
