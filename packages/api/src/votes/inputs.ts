import { z } from 'zod';

import { voteTypeSchema } from './types';

const requiredId = (label: string) =>
  z
    .string({ error: `${label} is required` })
    .min(1, `${label} cannot be empty`);

const baseVoteSchema = z.object({
  memberId: requiredId('Member ID'),
  voteType: voteTypeSchema,
});

export const voteOnPostInputSchema = baseVoteSchema.extend({
  postId: requiredId('Post ID'),
});

export const voteOnCommentInputSchema = baseVoteSchema.extend({
  commentId: requiredId('Comment ID'),
});

export type VoteOnPostInput = z.infer<typeof voteOnPostInputSchema>;
export type VoteOnCommentInput = z.infer<typeof voteOnCommentInputSchema>;
