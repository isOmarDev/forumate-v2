import { PostReadModel } from '../../domain/post-read-model';
import { Post } from '../../domain/post';
import { DatabaseError } from '@forumate/errors/server';
import { GetPostsQuery } from '@forumate/api';
import { DomainEvent } from '@forumate/core';

export interface PostsRepository {
  findPosts(query: GetPostsQuery): Promise<PostReadModel[]>;
  save(post: Post): Promise<void | DatabaseError>;
  getPostById(id: string): Promise<Post | null>;
  getPostDetailsById(id: string): Promise<PostReadModel | null>;
  getPostBySlug(slug: string): Promise<PostReadModel | null>;
}
