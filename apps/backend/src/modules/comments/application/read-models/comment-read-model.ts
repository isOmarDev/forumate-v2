export type CommentReadModelProps = {
  id: string;
  body: string;
  voteScore: number;
  parentCommentId: string | null;
  createdAt: string;
  member: { id: string; username: string; reputationLevel: string };
};
