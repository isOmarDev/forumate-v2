import { GetPostsQuery } from '@forumate/api/posts';

import { PostReadModel } from '../read-models/post-read-model';

export interface IFindPostsQuery {
  findPosts(query: GetPostsQuery): Promise<PostReadModel[]>;
}
export interface IGetPostDetailsByIdQuery {
  getPostDetailsById(id: string): Promise<PostReadModel | null>;
}
export interface IGetPostBySlugQuery {
  getPostBySlug(slug: string): Promise<PostReadModel | null>;
}

export type IPostsQueries = IFindPostsQuery &
  IGetPostDetailsByIdQuery &
  IGetPostBySlugQuery;
