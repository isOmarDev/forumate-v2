import { MemberDto } from '../members';

export type CommentDto = {
  id: string;
  postId: string;
  commentId: string;
  parentCommentId?: string;
  text: string;
  member: MemberDto;
  createdAt: string | Date;
  childComments: CommentDto[];
  points: number;
};
