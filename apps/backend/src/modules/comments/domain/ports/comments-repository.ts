import { Comment } from '../entities/comment';

// Not yet used.

export interface ICommentsRepository {
  save(comment: Comment): Promise<void>;
  getCommentById(id: string): Promise<Comment | null>;
  getCommentsByPostId(postId: string): Promise<Comment[]>;
}
