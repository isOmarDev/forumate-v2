import { GetPostsQuery } from '@forumate/api/posts';

import { Spy } from '../../../../shared/test-doubles/spy';
import type { IPostsRepository, IPostsQueries } from '../../application/ports';
import { PostReadModel } from '../../application/read-models/post-read-model';
import { Post } from '../../domain/entities/post';

export class InMemoryPostsRepository
  extends Spy<IPostsRepository & IPostsQueries>
  implements IPostsRepository, IPostsQueries
{
  private posts: Post[] = [];
  private readModels: PostReadModel[] = [];

  // ---- Write side ----

  public async getPostById(id: string): Promise<Post | null> {
    this.addCall('getPostById', [id]);

    return this.posts.find((post) => post.id === id) ?? null;
  }

  public async save(post: Post): Promise<void> {
    this.addCall('save', [post]);

    const existingIndex = this.posts.findIndex((p) => p.id === post.id);
    if (existingIndex >= 0) {
      this.posts[existingIndex] = post;
    } else {
      this.posts.push(post);
    }
  }

  // ---- Read side ----

  public async findPosts(query: GetPostsQuery): Promise<PostReadModel[]> {
    this.addCall('findPosts', [query]);

    return this.readModels;
  }

  public async getPostDetailsById(id: string): Promise<PostReadModel | null> {
    this.addCall('getPostDetailsById', [id]);

    return this.readModels.find((post) => post.id === id) ?? null;
  }

  public async getPostBySlug(slug: string): Promise<PostReadModel | null> {
    this.addCall('getPostBySlug', [slug]);

    return this.readModels.find((post) => post.slug === slug) ?? null;
  }

  // ---- Test setup helpers (no call tracking) ----

  public seedPosts(...posts: Post[]): void {
    this.posts.push(...posts);
  }

  public seedReadModels(...readModels: PostReadModel[]): void {
    this.readModels.push(...readModels);
  }

  public static createWithSeedData(): InMemoryPostsRepository {
    const repo = new InMemoryPostsRepository();
    // repo.seedPosts(...);
    // repo.seedReadModels(...);
    return repo;
  }

  public async reset(): Promise<void> {
    this.posts = [];
    this.readModels = [];
    this.calls = [];
  }
}
