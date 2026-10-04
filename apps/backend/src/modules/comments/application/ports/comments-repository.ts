import { Comment } from '../../domain/entities/comment';

export interface ICommentsRepository {
  save(comment: Comment): Promise<void>;
  getCommentById(id: string): Promise<Comment | null>;
  getCommentsByPostId(postId: string): Promise<Comment[]>;
}
