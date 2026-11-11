import { z } from 'zod';

// Vote Types
export const voteTypeSchema = z.enum(['upvote', 'downvote']);

export type VoteType = z.infer<typeof voteTypeSchema>;
