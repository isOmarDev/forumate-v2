import { MemberDto } from '../members';

export type CommentDto = {
  id: string;
  postId: string;
  commentId: string;
  parentCommentId?: string;
  body: string;
  member: MemberDto;
  createdAt: string;
  childComments: CommentDto[];
  points: number;
};
