import { ReputationLevel } from '@forumate/api';

export type CommentReadModelProps = {
  id: string;
  postId: string;
  parentCommentId: string | null;
  body: string;
  voteScore: number;
  replyCount: number;
  author: { id: string; username: string; reputationLevel: ReputationLevel };
  postedAt: Date;
};

export class CommentReadModel {
  private constructor(private props: CommentReadModelProps) {}

  get id(): string {
    return this.props.id;
  }

  get postId(): string {
    return this.props.postId;
  }

  get parentCommentId(): string | null {
    return this.props.parentCommentId;
  }

  get body(): string {
    return this.props.body;
  }

  get voteScore(): number {
    return this.props.voteScore;
  }

  get replyCount(): number {
    return this.props.replyCount;
  }

  get author(): CommentReadModelProps['author'] {
    return { ...this.props.author };
  }

  get postedAt(): Date {
    return this.props.postedAt;
  }

  public static create(props: CommentReadModelProps): CommentReadModel {
    return new CommentReadModel(props);
  }
}
