import { MemberDto } from '../members/dtos';

export type PostDto = {
  id: string;
  postType: string;
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
