export type PostCommentInput = {
  postId: string;
  text: string;
  memberId: string;
  parentCommentId?: string;
};