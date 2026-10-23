import { z } from 'zod';

import { voteTypeSchema } from './types';

export const voteOnCommentInputSchema = z.object({
  commentId: z
    .string({
      error: 'Comment ID is required',
    })
    .min(1, 'Comment ID cannot be empty'),
  memberId: z
    .string({
      error: 'Member ID is required',
    })
    .min(1, 'Member ID cannot be empty'),
  voteType: voteTypeSchema,
});

export type VoteOnCommentInput = z.infer<typeof voteOnCommentInputSchema>;

export const voteOnPostInputSchema = z.object({
  postId: z
    .string({
      error: 'Member ID is required',
    })
    .min(1, 'Post ID cannot be empty'),
  memberId: z
    .string({
      error: 'Member ID is required',
    })
    .min(1, 'Member ID cannot be empty'),
  voteType: voteTypeSchema,
});

export type VoteOnPostInput = z.infer<typeof voteOnPostInputSchema>;
