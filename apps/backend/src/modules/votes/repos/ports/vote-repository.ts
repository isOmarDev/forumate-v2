import { MemberCommentVotesRoundup } from '../../application/read-models/member-comment-votes-roundup';
import { MemberPostVotesRoundup } from '../../application/read-models/member-post-votes-roundup';
import { CommentVote } from '../../domain/entities/comment-vote';
import { PostVote } from '../../domain/entities/post-vote';

export interface IVoteRepository {
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
