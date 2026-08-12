import { makeAutoObservable } from 'mobx';

import { PostDm } from '../domain/postDm';
import { IPostsStore } from './postsStore';
import { AuthStore } from '@/modules/auth/stores/authStore';
import { CreatePostInput, GetPostsQuery } from '@forumate/api';
import { ApiClient } from '@forumate/api';

export class PostsStore implements IPostsStore {
  public postsDm: PostDm[];

  constructor(
    private api: ApiClient,
    private authStore: AuthStore,
  ) {
    makeAutoObservable(this);
    this.postsDm = [];
  }

  async getPostBySlug(slug: string): Promise<PostDm | null> {
    const response = await this.api.posts.getPostBySlug(slug);
    if (response.success && response.data) {
      return PostDm.fromDTO(response.data);
    }
    return null;
  }

  async getPosts(query?: GetPostsQuery): Promise<PostDm[]> {
    const getPostsResponse = await this.api.posts.getPosts({
      sort: query?.sort ?? 'popular',
    });
    const postDTOs = getPostsResponse.data;
    if (!postDTOs) {
      return [];
    }
    this.postsDm = postDTOs.map((postDTO) => PostDm.fromDTO(postDTO));
    return this.postsDm;
  }

  async create(input: CreatePostInput): Promise<PostDm> {
    const authToken = this.authStore.getToken() ?? '';
    const response = await this.api.posts.create(input, authToken);
    if (!response.data) {
      throw new Error('Failed to create post');
    }
    const newPost = PostDm.fromDTO(response.data);
    this.postsDm.push(newPost);
    return newPost;
  }
}
