import { Spy } from '../../../../../shared/test-doubles/spy';
import type { IPostVotesRepository } from '../../../application/ports/post-votes-repository';
import { PostVote } from '../../../domain/entities/post-vote';

export class InMemoryPostVotesRepository
  extends Spy<IPostVotesRepository>
  implements IPostVotesRepository
{
  private votes: PostVote[] = [];

  public async findByMemberAndPostId(
    memberId: string,
    postId: string,
  ): Promise<PostVote | null> {
    this.addCall('findByMemberAndPostId', [memberId, postId]);

    return (
      this.votes.find(
        (vote) => vote.memberId === memberId && vote.postId === postId,
      ) ?? null
    );
  }

  public async save(vote: PostVote): Promise<void> {
    this.addCall('save', [vote]);

    const index = this.votes.findIndex(
      (existing) =>
        existing.memberId === vote.memberId && existing.postId === vote.postId,
    );

    if (index >= 0) {
      this.votes[index] = vote;
    } else {
      this.votes.push(vote);
    }
  }

  // ---- Test setup helpers (no call tracking) ----

  public seed(...votes: PostVote[]): void {
    this.votes.push(...votes);
  }

  public async reset(): Promise<void> {
    this.votes = [];
    this.calls = [];
  }

  public getAll(): PostVote[] {
    return this.votes;
  }
}
