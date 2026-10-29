import { Spy } from '../../../../shared/test-doubles/spy';
import type { ICommentVotesReadRepository } from '../../application/ports/comment-votes-read-repository';
import { MemberCommentVotesRoundup } from '../../application/read-models/member-comment-votes-roundup';
import { CommentVote } from '../../domain/entities/comment-vote';

export class InMemoryCommentVotesReadRepository
  extends Spy<ICommentVotesReadRepository>
  implements ICommentVotesReadRepository
{
  private votes: CommentVote[] = [];

  public async getMemberCommentVotesRoundup(
    memberId: string,
  ): Promise<MemberCommentVotesRoundup> {
    this.addCall('getMemberCommentVotesRoundup', [memberId]);

    const memberVotes = this.votes.filter((vote) => vote.memberId === memberId);

    return MemberCommentVotesRoundup.toDomain({
      memberId,
      allCommentsCount: memberVotes.length,
      upvotesCount: memberVotes.filter((vote) => vote.getValue() === 1).length,
      downvotesCount: memberVotes.filter((vote) => vote.getValue() === -1)
        .length,
    });
  }

  // ---- Test setup helpers (no call tracking) ----

  public seed(...votes: CommentVote[]): void {
    this.votes.push(...votes);
  }

  public async reset(): Promise<void> {
    this.votes = [];
    this.calls = [];
  }

  public getAll(): CommentVote[] {
    return this.votes;
  }
}
