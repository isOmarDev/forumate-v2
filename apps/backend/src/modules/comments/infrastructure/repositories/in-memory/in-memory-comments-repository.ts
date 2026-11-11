import { Spy } from '../../../../../shared/test-doubles/spy';
import { ICommentsRepository } from '../../../application/ports/comments-repository';
import { Comment } from '../../../domain/entities/comment';

export class InMemoryCommentsRepository
  extends Spy<ICommentsRepository>
  implements ICommentsRepository
{
  private comments: Comment[] = [];

  public async save(comment: Comment): Promise<void> {
    this.addCall('save', [comment]);

    const index = this.comments.findIndex((c) => c.id === comment.id);
    if (index >= 0) {
      this.comments[index] = comment;
    } else {
      this.comments.push(comment);
    }
  }

  public async findById(id: string): Promise<Comment | null> {
    this.addCall('findById', [id]);
    return this.comments.find((comment) => comment.id === id) ?? null;
  }

  public async findByPostId(postId: string): Promise<Comment[]> {
    this.addCall('findByPostId', [postId]);
    return this.comments.filter((comment) => comment.postId === postId);
  }

  public async findAuthorId(commentId: string) {
    this.addCall('findAuthorId', [commentId]);
    const comment = this.comments.find((comment) => comment.id === commentId);
    return comment?.memberId ?? null;
  }

  async updateVoteScore(commentId: string, scoreChange: number): Promise<void> {
    const index = this.comments.findIndex(
      (comment) => comment.id === commentId,
    );
    if (index === -1) throw new Error(`Comment ${commentId} not found`);

    const comment = this.comments[index]!;

    this.comments[index] = Comment.reconstitute({
      id: comment.id,
      postId: comment.postId,
      body: comment.body,
      parentCommentId: comment.parentCommentId,
      memberId: comment.memberId,
      voteScore: comment.voteScore + scoreChange,
    });
  }

  // ---- Test setup helpers (no call tracking) ----

  public seed(...comments: Comment[]): void {
    this.comments.push(...comments);
  }

  public async reset(): Promise<void> {
    this.comments = [];
    this.calls = [];
  }

  public getAll(): Comment[] {
    return this.comments;
  }
}
