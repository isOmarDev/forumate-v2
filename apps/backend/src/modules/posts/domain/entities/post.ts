import { randomUUID } from 'node:crypto';

import { z } from 'zod';

import { type CreatePostInput } from '@forumate/api/posts';
import { AggregateRoot } from '@forumate/core';
import { type Post as PostModel } from '@forumate/database';

import {
  mapPostValidationError,
  PostCreationError,
} from '../errors/posts-errors';
import { PostCreated } from '../events/post-created';
import { PostSlug } from '../value-objects/post-slug';

interface BasePostProps {
  id: string;
  memberId: string;
  title: string;
  voteScore: number;
  slug: PostSlug;
}

interface TextPostProps extends BasePostProps {
  postType: 'text';
  content: string;
  link?: undefined;
}

interface LinkPostProps extends BasePostProps {
  postType: 'link';
  link: string;
  content?: undefined;
}

type PostProps = TextPostProps | LinkPostProps;

// These could be value objects too
const createTextPostSchema = z.object({
  postType: z.literal('text'),

  title: z
    .string()
    .min(5, 'Post title must be at least 5 characters')
    .max(100, 'Post title must not exceed 100 characters'),

  content: z
    .string()
    .min(5, 'Post content must be at least 5 characters')
    .max(3000, 'Post content must not exceed 3000 characters'),

  link: z.never().optional(),
});

const createLinkPostSchema = z.object({
  postType: z.literal('link'),

  title: z
    .string()
    .min(5, 'Post title must be at least 5 characters')
    .max(100, 'Post title must not exceed 100 characters'),

  link: z.url('Post link must be a valid URL'),

  content: z.never().optional(),
});

const createPostSchema = z.discriminatedUnion('postType', [
  createTextPostSchema,
  createLinkPostSchema,
]);

export class Post extends AggregateRoot {
  constructor(private props: PostProps) {
    super();
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get link() {
    return this.props.link;
  }

  get memberId() {
    return this.props.memberId;
  }

  get content() {
    return this.props.content;
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

  public static create(input: CreatePostInput): Post | PostCreationError {
    const { memberId, ...postInput } = input;

    const result = createPostSchema.safeParse(postInput);

    if (!result.success) {
      return mapPostValidationError(result.error, input);
    }

    const postId = randomUUID();

    const post = new Post({
      ...result.data,
      memberId,
      id: postId,
      voteScore: 0,
      slug: PostSlug.create(result.data.title),
    });

    post.domainEvents.push(new PostCreated(postId, input.memberId));

    return post;
  }

  public static toDomain(prismaModel: PostModel): Post {
    const postVariant =
      prismaModel.postType === 'text'
        ? {
            postType: 'text' as const,
            content: prismaModel.content!,
          }
        : {
            postType: 'link' as const,
            link: prismaModel.link!,
          };

    return new Post({
      id: prismaModel.id,
      memberId: prismaModel.memberId,
      title: prismaModel.title,
      voteScore: prismaModel.voteScore,
      slug: PostSlug.toDomain(prismaModel.slug),
      ...postVariant,
    });
  }
}
