import { z } from 'zod';

// Vote Types
export const voteTypeSchema = z.enum(['upvote', 'downvote']);

export type VoteType = z.infer<typeof voteTypeSchema>;

// Vote status
export const VoteStatus = {
  UPVOTED: 'UPVOTED',
  DOWNVOTED: 'DOWNVOTED',
  NONE: 'NONE',
} as const;

export type VoteStatus = (typeof VoteStatus)[keyof typeof VoteStatus];

// Vote Values
export const VoteValue = {
  UP: 1,
  DOWN: -1,
  NONE: 0,
} as const;

export type VoteValue = (typeof VoteValue)[keyof typeof VoteValue];
