import { GetPostsQuery } from '@forumate/api/posts';

import { Spy } from '../../../../../shared/test-doubles/spy';
import type {
  IPostsRepository,
  IPostsReadRepository,
} from '../../../application/ports';
import { PostReadModel } from '../../../application/read-models/post-read-model';
import { Post } from '../../../domain/entities/post';

export class InMemoryPostsRepository
  extends Spy<IPostsRepository & IPostsReadRepository>
  implements IPostsRepository, IPostsReadRepository
{
  private posts: Post[] = [];
  private readModels: PostReadModel[] = [];

  // ---- Write side ----

  public async findById(id: string): Promise<Post | null> {
    this.addCall('findById', [id]);

    return this.posts.find((post) => post.id === id) ?? null;
  }

  public async findAuthorId(postId: string) {
    this.addCall('findAuthorId', [postId]);
    const post = this.posts.find((post) => post.id === postId);
    return post?.memberId ?? null;
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

  public async findDetailsById(id: string): Promise<PostReadModel | null> {
    this.addCall('findDetailsById', [id]);

    return this.readModels.find((post) => post.id === id) ?? null;
  }

  public async findBySlug(slug: string): Promise<PostReadModel | null> {
    this.addCall('findBySlug', [slug]);

    return this.readModels.find((post) => post.slug === slug) ?? null;
  }

  async updateVoteScore(postId: string, scoreChange: number): Promise<void> {
    const index = this.posts.findIndex((post) => post.id === postId);
    if (index === -1) throw new Error(`Comment ${postId} not found`);

    const post = this.posts[index]!;
    const voteScore = post.voteScore + scoreChange;

    const base = {
      id: post.id,
      memberId: post.memberId,
      slug: post.slug,
      title: post.title,
      voteScore,
    };

    this.posts[index] =
      post.postType === 'link'
        ? Post.reconstitute({ ...base, postType: 'link', link: post.link })
        : Post.reconstitute({
            ...base,
            postType: 'text',
            content: post.content,
          });
  }

  // ---- Test setup helpers (no call tracking) ----

  public seed(...posts: Post[]): void {
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

  public getAll(): Post[] {
    return this.posts;
  }
}
