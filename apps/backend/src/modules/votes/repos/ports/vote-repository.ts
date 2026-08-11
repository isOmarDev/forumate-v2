import { CommentVote } from '../../domain/comment-vote';
import { MemberCommentVotesRoundup } from '../../domain/member-comment-votes-roundup';
import { MemberPostVotesRoundup } from '../../domain/member-post-votes-roundup';
import { PostVote } from '../../domain/post-vote';

export interface VoteRepository {
  findVoteByMemberAndPostId(
    memberId: string,
    postId: string,
  ): Promise<PostVote | null>;
  findVoteByMemberAndCommentId(
    memberId: string,
    commentId: string,
  ): Promise<CommentVote | null>;
  // Always keep in mind the extremes. What if a member's comment has 1000 comments?
  // That's why we use a roundup.
  getMemberCommentVotesRoundup(
    memberId: string,
  ): Promise<MemberCommentVotesRoundup>;
  getMemberPostVotesRoundup(memberId: string): Promise<MemberPostVotesRoundup>;
  save(postOrCommentVote: CommentVote | PostVote): Promise<void>;
}
