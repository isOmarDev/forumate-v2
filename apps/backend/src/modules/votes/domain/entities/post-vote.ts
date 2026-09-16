import { randomUUID } from 'node:crypto';

import { PostVoteDto, VoteType } from '@forumate/api/votes';
import { AggregateRoot } from '@forumate/core';
import { ValidationError } from '@forumate/errors/application';

import { PostDownvoted } from '../events/post-downvoted';
import { PostUpvoted } from '../events/post-upvoted';

export type VoteState = 'Upvoted' | 'Downvoted' | 'Default';

interface PostVoteProps {
  id: string;
  memberId: string;
  postId: string;
  voteState: VoteState;
}

export class PostVote extends AggregateRoot {
  private props: PostVoteProps;

  private constructor(props: PostVoteProps) {
    super();
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get memberId(): string {
    return this.props.memberId;
  }

  get postId(): string {
    return this.props.postId;
  }

  get voteState(): VoteState {
    return this.props.voteState;
  }

  getValue() {
    switch (this.props.voteState) {
      case 'Upvoted':
        return 1;
      case 'Downvoted':
        return -1;
      default:
        return 0;
    }
  }

  castVote(voteType: VoteType) {
    if (voteType === 'upvote') {
      this.upvote();
    } else {
      this.downvote();
    }
  }

  private upvote() {
    if (this.props.voteState === 'Upvoted') {
      return;
    }
    this.props.voteState = 'Upvoted';
    this.domainEvents.push(
      new PostUpvoted(this.id, this.props.postId, this.props.memberId),
    );
  }

  private downvote() {
    if (this.props.voteState === 'Downvoted') {
      return;
    }
    this.props.voteState = 'Downvoted';
    this.domainEvents.push(
      new PostDownvoted(this.id, this.props.postId, this.props.memberId),
    );
  }

  public static toDomain(props: PostVoteProps): PostVote {
    return new PostVote(props);
  }

  public static create(
    memberId: string,
    postId: string,
  ): PostVote | ValidationError {
    return new PostVote({
      id: randomUUID(),
      memberId: memberId,
      postId: postId,
      voteState: 'Default',
    });
  }

  public toDTO(): PostVoteDto {
    return {
      memberId: this.props.memberId,
      postId: this.props.postId,
      voteType: this.props.voteState === 'Upvoted' ? 'upvote' : 'downvote',
    };
  }
}
