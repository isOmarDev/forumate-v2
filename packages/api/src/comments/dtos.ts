import { MemberDTO } from '../members';

export type CommentDTO = {
  id: string;
  postId: string;
  commentId: string;
  parentCommentId?: string;
  text: string;
  member: MemberDTO;
  createdAt: string | Date;
  childComments: CommentDTO[];
  points: number;
};