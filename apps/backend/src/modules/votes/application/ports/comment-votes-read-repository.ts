import { MemberCommentVotesRoundup } from '../read-models/member-comment-votes-roundup';

export interface ICommentVotesReadRepository {
  getMemberCommentVotesRoundup(
    memberId: string,
  ): Promise<MemberCommentVotesRoundup>;
}
