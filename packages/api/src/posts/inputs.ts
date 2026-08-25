export type PostType = 'link' | 'text';

export type CreatePostInput = {
  title: string;
  memberId: string;
  content?: string;
  link?: string;
  postType: PostType;
};
