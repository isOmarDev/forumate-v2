import { z } from 'zod';

// Create Comment
export const createCommentInputSchema = z.object({
  postId: z.string('Post ID is required').min(1, 'Post ID cannot be empty'),
  text: z
    .string()
    .trim()
    .min(1, 'Comment text is required')
    .max(100, 'Comment text must not exceed 100 characters'),
  memberId: z
    .string('Member ID is required')
    .min(1, 'Member ID cannot be empty'),
  parentCommentId: z.string().min(1).optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

// Get Comments by Post Id
export const getCommentsByPostIdQueryInputSchema = z.object({
  postId: z.string().min(1),
});
export type GetCommentsByPostIdQueryInput = z.infer<
  typeof getCommentsByPostIdQueryInputSchema
>;
