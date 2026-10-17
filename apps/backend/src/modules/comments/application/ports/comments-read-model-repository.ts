import { CommentReadModel } from '../read-models/comment-read-model';

export interface ICommentsReadModelRepository {
  save(commentReadModel: CommentReadModel): Promise<void>;
  findById(commentId: string): Promise<CommentReadModel>;
}
