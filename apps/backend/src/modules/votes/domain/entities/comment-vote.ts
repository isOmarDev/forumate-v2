import { randomUUID } from 'node:crypto';

import { DomainEvent } from '@forumate/core/domain';

import { CommentDownvoted } from '../events/comment-downvoted';
import { CommentUnvoted } from '../events/comment-unvoted';
import { CommentUpvoted } from '../events/comment-upvoted';
import { CommentVoteEventData } from '../events/types';
import { VoteStatus } from '../value-objects/vote-status';

import { Vote, VoteProps } from './vote';

export type CreateCommentVoteProps = { memberId: string; commentId: string };

interface CommentVoteProps extends VoteProps {
  commentId: string;
}

export class CommentVote extends Vote<CommentVoteProps> {
  private constructor(props: CommentVoteProps) {
    super(props);
  }

  get commentId(): string {
    return this.props.commentId;
  }

  public static create({
    memberId,
    commentId,
  }: CreateCommentVoteProps): CommentVote {
    return new CommentVote({
      id: randomUUID(),
      commentId: commentId,
      memberId: memberId,
      voteStatus: VoteStatus.unvoted(),
    });
  }

  public static reconstitute(props: CommentVoteProps): CommentVote {
    return new CommentVote({ ...props });
  }

  protected createVoteChangeEvent(
    voteStatus: VoteStatus,
    scoreChange: number,
    authorId: string,
  ): DomainEvent<CommentVoteEventData> {
    const eventData: CommentVoteEventData = {
      voteId: this.id,
      voterId: this.memberId,
      commentId: this.commentId,
      isSelfVote: this.memberId === authorId,
      scoreChange,
      authorId,
    };

    if (voteStatus.isUpvoted()) return new CommentUpvoted(eventData);
    if (voteStatus.isDownvoted()) return new CommentDownvoted(eventData);
    return new CommentUnvoted(eventData);
  }
}
