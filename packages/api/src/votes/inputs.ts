import { z } from 'zod';

import { voteTypeSchema } from './types';

export const voteOnCommentInputSchema = z.object({
  commentId: z.string().min(1, 'Comment ID is required'),
  voteType: voteTypeSchema,
  memberId: z.string().min(1, 'Member ID is required'),
});

export type VoteOnCommentInput = z.infer<typeof voteOnCommentInputSchema>;

export const voteOnPostInputSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  voteType: voteTypeSchema,
  memberId: z.string().min(1, 'Member ID is required'),
});

export type VoteOnPostInput = z.infer<typeof voteOnPostInputSchema>;
