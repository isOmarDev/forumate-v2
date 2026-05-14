import { Post } from '../../../shared/database';

export interface IPostRepository {
  findAll(filters?: {}): Promise<Post[]>;
}
