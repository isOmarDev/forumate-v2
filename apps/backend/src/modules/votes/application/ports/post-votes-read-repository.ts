import { MemberPostVotesRoundup } from '../read-models/member-post-votes-roundup';

export interface IPostVotesReadRepository {
  getMemberPostVotesRoundup(memberId: string): Promise<MemberPostVotesRoundup>;
}
