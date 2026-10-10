import { Comment } from '../../domain/entities/comment';

export interface ICommentsRepository {
  save(comment: Comment): Promise<void>;
  findById(id: string): Promise<Comment | null>;
  findByPostId(postId: string): Promise<Comment[]>;
}
