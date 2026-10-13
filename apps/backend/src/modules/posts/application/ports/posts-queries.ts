import { GetPostsQuery } from '@forumate/api/posts';

import { PostReadModel } from '../read-models/post-read-model';

export interface IFindPostsQuery {
  findPosts(query: GetPostsQuery): Promise<PostReadModel[]>;
}
export interface IFindPostDetailsByIdQuery {
  findDetailsById(id: string): Promise<PostReadModel | null>;
}
export interface IFindPostBySlugQuery {
  findBySlug(slug: string): Promise<PostReadModel | null>;
}

export type IPostsQueries = IFindPostsQuery &
  IFindPostDetailsByIdQuery &
  IFindPostBySlugQuery;
