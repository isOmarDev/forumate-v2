import { DatabaseError } from '@forumate/errors/server';

import { Post } from '../../domain/entities/post';

export interface IPostsRepository {
  getPostById(id: string): Promise<Post | null>;
  save(post: Post): Promise<void | DatabaseError>;
}
