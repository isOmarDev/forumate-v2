import { MemberDTO } from '../members';

export type PostDTO = {
  id: string;
  postType: string;
  title: string;
  content?: string;
  link?: string;
  dateCreated: string;
  member: MemberDTO;
  numComments: number;
  voteScore: number;
  lastUpdated: string;
  slug: string;
};