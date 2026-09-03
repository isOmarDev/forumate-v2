// Create Post
import { z } from 'zod';

import { PostTypeSchema } from './types';

// Create post
const TextPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Post title must be at least 5 characters')
    .max(100, 'Post title must not exceed 100 characters'),

  content: z
    .string()
    .min(5, 'Post content must be at least 5 characters')
    .max(3000, 'Post content must not exceed 3000 characters'),
  postType: z.literal(PostTypeSchema.enum.text),
  memberId: z.string().min(1, 'Member ID is required'),
});

const LinkPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Post title must be at least 5 characters')
    .max(100, 'Post title must not exceed 100 characters'),
  link: z.url('Post link must be a valid URL'),
  postType: z.literal(PostTypeSchema.enum.link),
  memberId: z.string().min(1, 'Member ID is required'),
});

export const createPostInputSchema = z.discriminatedUnion('postType', [
  TextPostSchema,
  LinkPostSchema,
]);

export type CreatePostInput = z.infer<typeof createPostInputSchema>;

// Get Posts
export const getPostsQueryInputSchema = z.object({
  sort: z.enum(['popular', 'recent']),
});

export type GetPostsQueryInput = z.infer<typeof getPostsQueryInputSchema>;

export type GetPostsQueryOption = z.infer<
  typeof getPostsQueryInputSchema.shape.sort
>;

// Get Post by id
export const getPostByIdQueryInputSchema = z.object({
  postId: z.string().min(1),
});

export type GetPostByIdQueryInput = z.infer<typeof getPostByIdQueryInputSchema>;
