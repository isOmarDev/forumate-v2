import { CommentReadModel } from '../read-models/comment-read-model';

export interface ICommentsReadRepository {
  save(commentReadModel: CommentReadModel): Promise<void>;
  findById(commentId: string): Promise<CommentReadModel | null>;
  listByPostId(postId: string): Promise<CommentReadModel[]>;
}
