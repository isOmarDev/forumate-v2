import { MemberDto } from '../members/dtos';

import { PostType } from './types';

export type PostDto = {
  id: string;
  postType: PostType;
  title: string;
  content?: string;
  link?: string;
  slug: string;
  member: MemberDto;
  numComments: number;
  voteScore: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePostDto = { id: string; slug: string };
