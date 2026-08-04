import { Post } from '@forumate/database';

export interface IPostRepository {
  findAll(filters?: object): Promise<Post[]>;
}
