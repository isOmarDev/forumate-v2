import { Comment } from '../../domain/entities/comment';

export interface ICommentsRepository {
  findById(id: string): Promise<Comment | null>;
  findByPostId(postId: string): Promise<Comment[]>;
  findAuthorId(postId: string): Promise<string | null>;
  save(comment: Comment): Promise<void>;
  updateVoteScore(commentId: string, scoreChange: number): Promise<void>;
}
