import { VoteType } from './inputs';

export type PostVoteDto = {
  postId: string;
  memberId: string;
  voteType: VoteType;
};
