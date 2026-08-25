import { Comment } from '../../domain/entities/comment';

// Not yet used.

export interface CommentRepository {
  save(comment: Comment): Promise<void>;
  getCommentById(id: string): Promise<Comment | null>;
  getCommentsByPostId(postId: string): Promise<Comment[]>;
}
