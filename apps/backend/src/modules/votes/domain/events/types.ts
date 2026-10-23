export type CommentVoteEventData = {
  voteId: string;
  commentId: string;
  memberId: string;
  scoreChange: number;
};

export type PostVoteEventData = {
  voteId: string;
  postId: string;
  memberId: string;
  scoreChange: number;
};
