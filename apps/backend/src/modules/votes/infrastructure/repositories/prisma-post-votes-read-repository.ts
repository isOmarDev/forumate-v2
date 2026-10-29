import { type IDatabase } from '@forumate/database';

import { IPostVotesReadRepository } from '../../application/ports/post-votes-read-repository';
import { MemberPostVotesRoundup } from '../../application/read-models/member-post-votes-roundup';

export class PrismaPostVotesReadRepository implements IPostVotesReadRepository {
  constructor(private database: IDatabase) {}

  async getMemberPostVotesRoundup(
    memberId: string,
  ): Promise<MemberPostVotesRoundup> {
    try {
      const connection = this.database.getClient();
      const [allPostsCount, upvotesCount, downvotesCount] = await Promise.all([
        connection.postVote.count({
          where: { post: { memberId } },
        }),
        connection.postVote.count({
          where: { post: { memberId }, value: 1 },
        }),
        connection.postVote.count({
          where: { post: { memberId }, value: -1 },
        }),
      ]);

      const roundup = MemberPostVotesRoundup.toDomain({
        memberId,
        allPostsCount,
        upvotesCount,
        downvotesCount,
      });

      return roundup;
    } catch (err) {
      console.log(err);
      throw new Error('Error getting member post votes roundup', {
        cause: err,
      });
    }
  }
}
