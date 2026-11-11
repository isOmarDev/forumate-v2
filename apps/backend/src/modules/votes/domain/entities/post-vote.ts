import { randomUUID } from 'node:crypto';

import { DomainEvent } from '@forumate/core';

import { PostDownvoted } from '../events/post-downvoted';
import { PostUnvoted } from '../events/post-unvoted';
import { PostUpvoted } from '../events/post-upvoted';
import { PostVoteEventData } from '../events/types';
import { VoteStatus } from '../value-objects/vote-status';

import { Vote, type VoteProps } from './vote';

export type CreatePostVoteProps = {
  memberId: string;
  postId: string;
};

interface PostVoteProps extends VoteProps {
  postId: string;
}

export class PostVote extends Vote<PostVoteProps> {
  private constructor(props: PostVoteProps) {
    super(props);
  }

  get postId(): string {
    return this.props.postId;
  }

  public static create(props: CreatePostVoteProps): PostVote {
    return new PostVote({
      id: randomUUID(),
      memberId: props.memberId,
      postId: props.postId,
      voteStatus: VoteStatus.unvoted(),
    });
  }

  public static reconstitute(props: PostVoteProps): PostVote {
    return new PostVote({ ...props });
  }

  protected createVoteChangeEvent(
    voteStatus: VoteStatus,
    scoreChange: number,
    authorId: string,
  ): DomainEvent<PostVoteEventData> {
    const eventData: PostVoteEventData = {
      voteId: this.id,
      voterId: this.memberId,
      postId: this.postId,
      isSelfVote: this.memberId === authorId,
      scoreChange,
      authorId,
    };

    if (voteStatus.isUpvoted()) return new PostUpvoted(eventData);
    if (voteStatus.isDownvoted()) return new PostDownvoted(eventData);
    return new PostUnvoted(eventData);
  }
}
