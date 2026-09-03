import { VoteType } from './types';

export type PostVoteDto = {
  postId: string;
  memberId: string;
  voteType: VoteType;
};
