import { makeAutoObservable } from 'mobx';

import { CreatePostInput, GetPostsQuery, PostDto } from '@forumate/api/posts';

import { PostDm } from '../domain/postDm';

import { IPostsStore } from './postsStore';

export class FakePostsStore implements IPostsStore {
  postsDm: PostDm[] = [];

  constructor(fakePostsData: PostDto[]) {
    makeAutoObservable(this);
    this.postsDm = fakePostsData.map((postDto) => PostDm.fromDTO(postDto));
  }

  async getPosts(query?: GetPostsQuery): Promise<PostDm[]> {
    if (query?.sort === 'recent') {
      return this.postsDm.sort((a, b) => {
        const dateA = a.props.dateCreated || new Date().toISOString();
        const dateB = b.props.dateCreated || new Date().toISOString();
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    } else if (query?.sort === 'popular') {
      return this.postsDm.sort(
        (a, b) => (b.props.voteScore || 0) - (a.props.voteScore || 0),
      );
    }
    return this.postsDm;
  }

  async create(input: CreatePostInput): Promise<PostDm> {
    const newPost = new PostDm({
      id: '2332',
      title: input.title,
      content: input.content || '',
      memberId: 'fake-member',
      memberUsername: 'fake-user',
      numComments: 0,
      dateCreated: new Date().toISOString(),
      voteScore: 0,
      slug: input.title.toLowerCase().replace(/\s+/g, '-'),
    });
    this.postsDm.push(newPost);
    return newPost;
  }

  async getPostBySlug(slug: string): Promise<PostDm | null> {
    return this.postsDm.find((post) => post.props.slug === slug) || null;
  }
}
