import { randomUUID } from 'node:crypto';

import { AggregateRoot } from '@forumate/core/domain';

import { CommentDownvoted } from '../events/comment-downvoted';
import { CommentUnvoted } from '../events/comment-unvoted';
import { CommentUpvoted } from '../events/comment-upvoted';
import { CommentVoteEventData } from '../events/types';
import { VoteStatus, VoteValue } from '../value-objects/vote-status';

type VoteAction = 'upvote' | 'downvote';

interface CommentVoteProps {
  id: string;
  memberId: string;
  commentId: string;
  voteStatus: VoteStatus;
}

export class CommentVote extends AggregateRoot {
  private constructor(private props: CommentVoteProps) {
    super();
  }

  get id(): string {
    return this.props.id;
  }

  get memberId(): string {
    return this.props.memberId;
  }

  get commentId(): string {
    return this.props.commentId;
  }

  get voteStatus(): VoteStatus {
    return this.props.voteStatus;
  }

  public static create(memberId: string, commentId: string): CommentVote {
    return new CommentVote({
      id: randomUUID(),
      memberId: memberId,
      commentId: commentId,
      voteStatus: VoteStatus.unvoted(),
    });
  }

  public static reconstitute(props: CommentVoteProps): CommentVote {
    return new CommentVote({ ...props });
  }

  public getValue(): VoteValue {
    return this.props.voteStatus.toValue();
  }

  public castVote(voteAction: VoteAction): void {
    const oldStatus = this.props.voteStatus;

    switch (voteAction) {
      case 'upvote':
        this.upvote();
        break;
      case 'downvote':
        this.downvote();
        break;
      default: {
        const _exhaustive: never = voteAction;
        throw new Error(`Unhandled vote action: ${_exhaustive}`);
      }
    }

    const newStatus = this.voteStatus;
    const scoreChange = newStatus.toValue() - oldStatus.toValue();

    this.addVoteChangeEvent(newStatus, scoreChange);
  }

  private upvote(): void {
    this.props.voteStatus = this.props.voteStatus.isUpvoted()
      ? VoteStatus.unvoted()
      : VoteStatus.upvoted();
  }

  private downvote(): void {
    this.props.voteStatus = this.props.voteStatus.isDownvoted()
      ? VoteStatus.unvoted()
      : VoteStatus.downvoted();
  }

  private addVoteChangeEvent(
    voteStatus: VoteStatus,
    scoreChange: number,
  ): void {
    const eventData: CommentVoteEventData = {
      voteId: this.id,
      memberId: this.memberId,
      commentId: this.commentId,
      scoreChange,
    };

    if (voteStatus.isUpvoted()) {
      this.addEvent(new CommentUpvoted(eventData));
    } else if (voteStatus.isDownvoted()) {
      this.addEvent(new CommentDownvoted(eventData));
    } else {
      this.addEvent(new CommentUnvoted(eventData));
    }
  }
}
