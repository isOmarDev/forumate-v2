import { randomUUID } from 'node:crypto';

import { AggregateRoot } from '@forumate/core';

import { CommentPosted } from '../events/comment-posted';

export interface CommentProps {
  id: string;
  postId: string;
  body: string;
  memberId: string;
  parentCommentId?: string | undefined;
  voteScore: number;
}

type CreateCommentProps = {
  postId: string;
  body: string;
  memberId: string;
  parentCommentId?: string;
};

export class Comment extends AggregateRoot {
  private constructor(private props: CommentProps) {
    super();
  }

  get id() {
    return this.props.id;
  }

  get postId() {
    return this.props.postId;
  }

  get body() {
    return this.props.body;
  }

  get parentCommentId() {
    return this.props.parentCommentId;
  }

  get voteScore() {
    return this.props.voteScore;
  }

  get memberId() {
    return this.props.memberId;
  }

  public static create(props: CreateCommentProps): Comment {
    const comment = new Comment({
      id: randomUUID(),
      body: props.body,
      memberId: props.memberId,
      postId: props.postId,
      parentCommentId: props.parentCommentId,
      voteScore: 0,
    });

    comment.addEvent(
      new CommentPosted(comment.id, comment.memberId, comment.postId),
    );

    return comment;
  }

  public static reconstitute(props: CommentProps): Comment {
    return new Comment({ ...props });
  }
}
