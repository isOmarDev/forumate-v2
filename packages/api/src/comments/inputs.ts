import { z } from 'zod';

// Create Comment
export const postCommentInputSchema = z.object({
  postId: z.string('Post Id is required').min(1, 'Post Id cannot be empty'),
  body: z
    .string('comment body is required')
    .trim()
    .min(1, 'Comment body cannot be empty'),
  memberId: z
    .string('Member Id is required')
    .min(1, 'Member Id cannot be empty'),
  parentCommentId: z.string().min(1).optional(),
});

export type PostCommentInput = z.infer<typeof postCommentInputSchema>;

// Get Comments by Post Id
export const getCommentsByPostIdQueryInputSchema = z.object({
  postId: z.string().min(1),
});
export type GetCommentsByPostIdQueryInput = z.infer<
  typeof getCommentsByPostIdQueryInputSchema
>;
