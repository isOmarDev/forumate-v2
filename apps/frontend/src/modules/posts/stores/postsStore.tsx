import { CreatePostInput, GetPostsQuery } from '@forumate/api';

import { PostDm } from '../domain/postDm';

export interface IPostsStore {
  postsDm: PostDm[];
  getPosts(query?: GetPostsQuery): Promise<PostDm[]>;
  create(input: CreatePostInput): Promise<PostDm>;
  getPostBySlug(slug: string): Promise<PostDm | null>;
}
