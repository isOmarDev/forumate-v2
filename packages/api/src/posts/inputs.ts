// Create Post
import { z } from 'zod';

import { PostTypeSchema } from './types';

// Create text/link post
export const TextPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().trim().min(1, 'Post content is required'),
  postType: z.literal(PostTypeSchema.enum.text),
  memberId: z.string().min(1, 'Member ID is required'),
});

export const LinkPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  link: z.string().trim().min(1, 'Post link is required'),
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
