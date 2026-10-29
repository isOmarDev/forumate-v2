import { GetPostsQuery } from '@forumate/api/posts';

import { PostReadModel } from '../read-models/post-read-model';

export type IPostsReadRepository = {
  findPosts(query: GetPostsQuery): Promise<PostReadModel[]>;
  findDetailsById(id: string): Promise<PostReadModel | null>;
  findBySlug(slug: string): Promise<PostReadModel | null>;
};
