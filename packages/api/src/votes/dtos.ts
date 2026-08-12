import { VoteType } from './inputs';

export type PostVoteDTO = {
  postId: string;
  memberId: string;
  voteType: VoteType;
};