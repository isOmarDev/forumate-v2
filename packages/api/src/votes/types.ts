import { z } from 'zod';

export const voteTypeSchema = z.enum(['upvote', 'downvote']);
export type VoteType = z.infer<typeof voteTypeSchema>;
