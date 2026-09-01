import { z } from 'zod';

export const createMemberInputSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  email: z.email('Invalid email address'),
  userId: z.string().min(1, 'User ID is required'),
});

export type CreateMemberInput = z.infer<typeof createMemberInputSchema>;
