import { Spy } from '../../../../shared/test-doubles/spy';
import { ICommentsRepository } from '../../application/ports/comments-repository';
import { Comment } from '../../domain/entities/comment';

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

  // ---- Test setup helpers (no call tracking) ----

  public seed(...comments: Comment[]): void {
    this.comments.push(...comments);
  }

  public async reset(): Promise<void> {
    this.comments = [];
    this.calls = [];
  }
}
