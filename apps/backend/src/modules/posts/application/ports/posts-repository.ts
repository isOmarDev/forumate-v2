import { GetPostsQuery } from '@forumate/api';
import { DatabaseError } from '@forumate/errors/server';

import { PostReadModel } from '../../application/read-models/post-read-model';
import { Post } from '../../domain/entities/post';

export interface IPostsRepository {
  findPosts(query: GetPostsQuery): Promise<PostReadModel[]>;
  save(post: Post): Promise<void | DatabaseError>;
  getPostById(id: string): Promise<Post | null>;
  getPostDetailsById(id: string): Promise<PostReadModel | null>;
  getPostBySlug(slug: string): Promise<PostReadModel | null>;
}
