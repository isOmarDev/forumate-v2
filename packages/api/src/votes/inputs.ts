import { z } from 'zod';

import { voteTypeSchema } from './types';

const requiredId = (label: string) =>
  z
    .string({ error: `${label} is required` })
    .min(1, `${label} cannot be empty`);

const memberIdSchema = requiredId('Member ID');
const commentIdSchema = requiredId('Comment ID');
const postIdSchema = requiredId('Post ID');

const baseVoteSchema = z.object({
  memberId: memberIdSchema,
  voteType: voteTypeSchema,
});

export const voteOnPostInputSchema = baseVoteSchema.extend({
  postId: postIdSchema,
});

export const voteOnCommentInputSchema = baseVoteSchema.extend({
  commentId: commentIdSchema,
});

export const CastInitialUpvoteOnCommentSchema = baseVoteSchema.extend({
  commentId: commentIdSchema,
});

export const CastInitialUpvoteOnPostSchema = baseVoteSchema.extend({
  postId: postIdSchema,
});

export type VoteOnPostInput = z.infer<typeof voteOnPostInputSchema>;
export type VoteOnCommentInput = z.infer<typeof voteOnCommentInputSchema>;
export type CastInitialUpvoteOnCommentInput = z.infer<
  typeof CastInitialUpvoteOnCommentSchema
>;
export type CastInitialUpvoteOnPostInput = z.infer<
  typeof CastInitialUpvoteOnPostSchema
>;
