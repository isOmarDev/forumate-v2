import { Post } from '../../../shared/database';

export interface IPostRepository {
  findAll(filters?: object): Promise<Post[]>;
}
