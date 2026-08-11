import { PostsRepository } from '../ports/postsRepository';
import { Post } from '../../domain/post';
import { PostReadModel } from '../../domain/postReadModel';
import { GetPostsQuery } from '@forumate/api/posts';
import { DatabaseError } from '@forumate/errors/server';
import { DomainEvent } from '@forumate/core';

export class InMemoryPostsRepository implements PostsRepository {
  private posts: PostReadModel[];

  constructor(posts?: PostReadModel[]) {
    this.posts = posts ? posts : [];
  }
  getPostById(id: string): Promise<Post | null> {
    throw new Error('Method not implemented.');
  }

  async findPosts(query: GetPostsQuery): Promise<PostReadModel[]> {
    return this.posts;
  }

  public static createWithSeedData(): InMemoryPostsRepository {
    // Put seed data here
    return new InMemoryPostsRepository();
  }

  public async save(post: Post): Promise<void | DatabaseError> {
    return Promise.resolve();
  }

  public async getPostDetailsById(id: string): Promise<PostReadModel | null> {
    return this.posts.find((post) => post.id === id) || null;
  }

  public async getPostBySlug(slug: string): Promise<PostReadModel | null> {
    return this.posts.find((post) => post.slug === slug) || null;
  }
}
