import { Spy } from '../../../../../shared/test-doubles/spy';
import type { ICommentsReadRepository } from '../../../application/ports/comments-read-repository';
import { CommentReadModel } from '../../../application/read-models/comment-read-model';

export class InMemoryCommentsReadRepository
  extends Spy<ICommentsReadRepository>
  implements ICommentsReadRepository
{
  private comments: CommentReadModel[] = [];

  public async save(commentReadModel: CommentReadModel): Promise<void> {
    this.addCall('save', [commentReadModel]);

    const index = this.comments.findIndex(
      (comment) => comment.id === commentReadModel.id,
    );

    if (index >= 0) {
      this.comments[index] = commentReadModel;
    } else {
      this.comments.push(commentReadModel);
    }
  }

  public async findById(commentId: string): Promise<CommentReadModel | null> {
    this.addCall('findById', [commentId]);

    return this.comments.find((comment) => comment.id === commentId) ?? null;
  }

  public async listByPostId(postId: string): Promise<CommentReadModel[]> {
    this.addCall('listByPostId', [postId]);

    return this.comments
      .filter((comment) => comment.postId === postId)
      .sort((a, b) => a.postedAt.getTime() - b.postedAt.getTime());
  }

  // ---- Test setup helpers (no call tracking) ----

  public seed(...comments: CommentReadModel[]): void {
    this.comments.push(...comments);
  }

  public async reset(): Promise<void> {
    this.comments = [];
    this.calls = [];
  }

  public getAll(): CommentReadModel[] {
    return this.comments;
  }
}
