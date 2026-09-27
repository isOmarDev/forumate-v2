import { randomUUID } from 'node:crypto';

import { AggregateRoot, Result, success } from '@forumate/core';

import { PostCreated } from '../events/post-created';
import { PostContent, PostLink, PostTitle, PostSlug } from '../value-objects';

export type CreateTextPostProps = {
  memberId: string;
  title: PostTitle;
  content: PostContent;
  postType: 'text';
};

export type CreateLinkPostProps = {
  memberId: string;
  title: PostTitle;
  link: PostLink;
  postType: 'link';
};

export type CreatePostProps = CreateTextPostProps | CreateLinkPostProps;

export interface BasePostProps {
  id: string;
  memberId: string;
  title: PostTitle;
  voteScore: number;
  slug: PostSlug;
}

interface TextPostProps extends BasePostProps {
  postType: 'text';
  content: PostContent;
}

interface LinkPostProps extends BasePostProps {
  postType: 'link';
  link: PostLink;
}

export type PostProps = TextPostProps | LinkPostProps;

export class Post extends AggregateRoot {
  private constructor(private props: PostProps) {
    super();
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get memberId() {
    return this.props.memberId;
  }

  get title() {
    return this.props.title.value;
  }

  get content(): string | undefined {
    return this.props.postType === 'text'
      ? this.props.content.value
      : undefined;
  }

  get link(): string | undefined {
    return this.props.postType === 'link' ? this.props.link.value : undefined;
  }

  get postType() {
    return this.props.postType;
  }

  get voteScore() {
    return this.props.voteScore;
  }

  get slug() {
    return this.props.slug.value;
  }

  public static create(input: CreatePostProps): Result<Post, never> {
    const baseProps = {
      id: randomUUID(),
      memberId: input.memberId,
      title: input.title,
      voteScore: 0,
      slug: PostSlug.create(input.title.value),
    };

    const props: PostProps =
      input.postType === 'text'
        ? { ...baseProps, postType: 'text', content: input.content }
        : { ...baseProps, postType: 'link', link: input.link };

    const post = new Post(props);
    post.domainEvents.push(new PostCreated(post.id, post.memberId));

    return success(post);
  }

  public static reconstitute(props: PostProps): Post {
    return new Post(props);
  }
}
