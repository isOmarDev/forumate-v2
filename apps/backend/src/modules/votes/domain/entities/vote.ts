import { AggregateRoot, DomainEvent } from '@forumate/core/domain';

import { VoteStatus, VoteValue } from '../value-objects/vote-status';

export type VoteAction = 'upvote' | 'downvote';

export interface VoteProps {
  id: string;
  memberId: string;
  voteStatus: VoteStatus;
}

export type CastVoteResult = {
  oldStatus: VoteStatus;
  newStatus: VoteStatus;
  scoreChange: number;
};

export abstract class Vote<TProps extends VoteProps> extends AggregateRoot {
  protected constructor(protected props: TProps) {
    super();
  }

  get id(): string {
    return this.props.id;
  }

  get memberId(): string {
    return this.props.memberId;
  }

  get voteStatus(): VoteStatus {
    return this.props.voteStatus;
  }

  public getValue(): VoteValue {
    return this.props.voteStatus.toValue();
  }

  protected abstract createVoteChangeEvent(
    status: VoteStatus,
    scoreChange: number,
    authorId: string,
  ): DomainEvent<unknown>;

  public castVote(voteAction: VoteAction, authorId: string): CastVoteResult {
    const oldStatus = this.props.voteStatus;
    const newStatus = this.nextStatus(oldStatus, voteAction);
    const scoreChange = this.calculateScoreChange(oldStatus, newStatus);

    this.props.voteStatus = newStatus;

    this.addDomainEvent(
      this.createVoteChangeEvent(newStatus, scoreChange, authorId),
    );

    return { oldStatus, newStatus, scoreChange };
  }

  private nextStatus(current: VoteStatus, action: VoteAction): VoteStatus {
    switch (action) {
      case 'upvote': {
        return current.isUpvoted()
          ? VoteStatus.unvoted()
          : VoteStatus.upvoted();
      }
      case 'downvote': {
        return current.isDownvoted()
          ? VoteStatus.unvoted()
          : VoteStatus.downvoted();
      }
      default: {
        const _exhaustive: never = action;
        throw new Error(`Unhandled vote action: ${_exhaustive}`);
      }
    }
  }

  private calculateScoreChange(
    oldStatus: VoteStatus,
    newStatus: VoteStatus,
  ): number {
    return newStatus.toValue() - oldStatus.toValue();
  }
}
