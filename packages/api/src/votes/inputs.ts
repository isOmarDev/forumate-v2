export type VoteType = 'upvote' | 'downvote';

export type VoteOnCommentInput = {
  commentId: string;
  voteType: VoteType;
  memberId: string;
};

export type VoteOnPostInput = {
  postId: string;
  voteType: VoteType;
  memberId: string;
};
