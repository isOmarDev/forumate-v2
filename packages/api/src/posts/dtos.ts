import { MemberDto } from '../members/dtos';

import { PostType } from './types';

export type PostDto = {
  id: string;
  postType: PostType;
  title: string;
  content?: string;
  link?: string;
  dateCreated: string;
  member: MemberDto;
  numComments: number;
  voteScore: number;
  lastUpdated: string;
  slug: string;
};
