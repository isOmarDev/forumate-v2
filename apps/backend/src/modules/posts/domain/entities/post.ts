import { randomUUID } from 'node:crypto';

import { AggregateRoot, Result, success } from '@forumate/core';

import {
  InvalidLinkPostError,
  InvalidTextPostError,
} from '../errors/posts-errors';
import { PostCreated } from '../events/post-created';
import {
  PostContent,
  PostLink,
  PostTitle,
  PostSlug,
  PostType,
} from '../value-objects';

export type CreateTextPostProps = {
  memberId: string;
  title: PostTitle;
  content: PostContent;
  postType: PostType;
};

export type CreateLinkPostProps = {
  memberId: string;
  title: PostTitle;
  link: PostLink;
  postType: PostType;
};

export type CreatePostProps = CreateTextPostProps | CreateLinkPostProps;

export interface BasePostProps {
  id: string;
  memberId: string;
  title: PostTitle;
  slug: PostSlug;
  voteScore: number;
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

  get id(): string {
    return this.props.id;
  }

  get memberId(): string {
    return this.props.memberId;
  }

  get title(): PostTitle {
    return this.props.title;
  }

  get content(): PostContent {
    if (this.props.postType !== 'text') {
      throw new Error('Cannot access content on a non-text post');
    }

    return this.props.content;
  }

  get link(): PostLink {
    if (this.props.postType !== 'link') {
      throw new Error('Cannot access link on a non-link post');
    }

    return this.props.link;
  }

  get postType(): PostProps['postType'] {
    return this.props.postType;
  }

  get slug(): PostSlug {
    return this.props.slug;
  }

  get voteScore(): number {
    return this.props.voteScore;
  }

  public static create(input: CreatePostProps): Result<Post, never> {
    const { memberId, postType, title } = input;

    const baseProps = {
      id: randomUUID(),
      memberId,
      title,
      voteScore: 0,
      slug: PostSlug.create(title.value),
    };

    let props: PostProps;

    if (postType.value === 'text') {
      if ('link' in input) {
        return fail(
          new InvalidTextPostError('A text post cannot contain a link'),
        );
      }

      props = { ...baseProps, postType: 'text', content: input.content };
    } else {
      if ('content' in input) {
        return fail(
          new InvalidLinkPostError('A link post cannot contain text content'),
        );
      }

      props = { ...baseProps, postType: 'link', link: input.link };
    }

    const post = new Post(props);
    post.domainEvents.push(new PostCreated(post.id, post.memberId));

    return success(post);
  }

  public static reconstitute(props: PostProps): Post {
    return new Post(props);
  }

  public isTextPost(): boolean {
    return this.props.postType === 'text';
  }

  public isLinkPost(): boolean {
    return this.props.postType === 'link';
  }
}
