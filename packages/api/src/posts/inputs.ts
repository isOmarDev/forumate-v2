// Create Post
export type PostType = 'link' | 'text';

export type CreatePostInput = {
  title: string;
  memberId: string;
  content?: string;
  link?: string;
  postType: PostType;
};

// Get Posts
export type GetPostsQueryOption = 'popular' | 'recent';

export type GetPostsQueryInput = {
  sort: GetPostsQueryOption;
};
