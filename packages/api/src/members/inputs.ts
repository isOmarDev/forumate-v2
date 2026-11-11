import { z } from 'zod';

// Create Member Input
export const createMemberInputSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  email: z.email('Invalid email address'),
  userId: z.string().min(1, 'User ID is required'),
});

export type CreateMemberInput = z.infer<typeof createMemberInputSchema>;

// Update Member Reputation Input
export const updateMemberReputationInputSchema = z.object({
  memberId: z
    .string({ error: 'Member ID is required' })
    .min(1, 'Member ID cannot be empty'),
  scoreChange: z
    .number({ error: 'Score change is required' })
    .int('Score change must be a whole number')
    .refine((value) => value !== 0, 'Score change cannot be zero'),
});

export type UpdateMemberReputationInput = z.infer<
  typeof updateMemberReputationInputSchema
>;
