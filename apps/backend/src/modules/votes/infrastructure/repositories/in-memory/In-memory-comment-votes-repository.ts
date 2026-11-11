import { Spy } from '../../../../../shared/test-doubles/spy';
import type { ICommentVotesRepository } from '../../../application/ports/comment-votes-repository';
import { CommentVote } from '../../../domain/entities/comment-vote';

export class InMemoryCommentVotesRepository
  extends Spy<ICommentVotesRepository>
  implements ICommentVotesRepository
{
  private votes: CommentVote[] = [];

  public async findByMemberAndCommentId(
    memberId: string,
    commentId: string,
  ): Promise<CommentVote | null> {
    this.addCall('findByMemberAndCommentId', [memberId, commentId]);

    return (
      this.votes.find(
        (vote) => vote.memberId === memberId && vote.commentId === commentId,
      ) ?? null
    );
  }

  public async save(vote: CommentVote): Promise<void> {
    this.addCall('save', [vote]);

    const index = this.votes.findIndex(
      (existing) =>
        existing.memberId === vote.memberId &&
        existing.commentId === vote.commentId,
    );

    if (index >= 0) {
      this.votes[index] = vote;
    } else {
      this.votes.push(vote);
    }
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
