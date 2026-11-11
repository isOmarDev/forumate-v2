export type VoteEventData = {
  voteId: string;
  voterId: string;
  authorId: string;
  scoreChange: number;
};

export type CommentVoteEventData = VoteEventData & {
  commentId: string;
  isSelfVote: boolean;
};

export type PostVoteEventData = VoteEventData & {
  postId: string;
  isSelfVote: boolean;
};
