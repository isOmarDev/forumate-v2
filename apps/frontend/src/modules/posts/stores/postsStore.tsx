import { PostDm } from '../domain/postDm';
import { CreatePostInput, GetPostsQuery } from '@forumate/api';

export interface IPostsStore {
  postsDm: PostDm[];
  getPosts(query?: GetPostsQuery): Promise<PostDm[]>;
  create(input: CreatePostInput): Promise<PostDm>;
  getPostBySlug(slug: string): Promise<PostDm | null>;
}
