import { z } from 'zod';

export const addEmailToListSchema = z.object({
  email: z.email('Invalid email address'),
});

export type AddEmailToListInput = z.infer<typeof addEmailToListSchema>;
