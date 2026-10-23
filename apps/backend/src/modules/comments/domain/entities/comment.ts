import { randomUUID } from 'node:crypto';

import { AggregateRoot, Result, success } from '@forumate/core';

import { CommentPosted } from '../events/comment-posted';
import { CommentBody } from '../value-objects/comment-body';

type CreateCommentProps = {
  postId: string;
  body: CommentBody;
  memberId: string;
  parentCommentId?: string;
};

export interface CommentProps {
  id: string;
  postId: string;
  body: CommentBody;
  memberId: string;
  parentCommentId?: string | undefined;
  voteScore: number;
}

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

  public static create(props: CreateCommentProps): Result<Comment, never> {
    const comment = new Comment({
      id: randomUUID(),
      body: props.body,
      memberId: props.memberId,
      postId: props.postId,
      parentCommentId: props.parentCommentId,
      voteScore: 0,
    });

    comment.addEvent(
      new CommentPosted({
        commentId: comment.id,
        parentCommentId: comment.parentCommentId ?? null,
        memberId: comment.memberId,
        postId: comment.postId,
      }),
    );

    return success(comment);
  }

  public static reconstitute(props: CommentProps): Comment {
    return new Comment({ ...props });
  }
}
