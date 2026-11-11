type VoteStatus = 'UPVOTED' | 'DOWNVOTED' | 'NONE';

export type VoteOnPostDto = {
  postId: string;
  voteStatus: VoteStatus;
};

export type VoteOnCommentDto = {
  commentId: string;
  voteStatus: VoteStatus;
};
