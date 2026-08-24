export type VoteType = 'upvote' | 'downvote';

// Inputs
// TODO: separate all inputs from commands; they're different - do this for all domains
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
