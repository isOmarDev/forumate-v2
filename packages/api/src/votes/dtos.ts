import { VoteStatus } from './types';

export type VoteOnPostDto = {
  postId: string;
  voteStatus: VoteStatus;
};

export type VoteOnCommentDto = {
  commentId: string;
  voteStatus: VoteStatus;
};
