import { z } from 'zod';

export const decodedIdTokenSchema = z.object({
  email: z.email('Invalid email address'),
  uid: z.string().min(1, 'UID is required'),
});

export type DecodedIdToken = z.infer<typeof decodedIdTokenSchema>;

export const createUserInputSchema = z.object({
  email: z.string().trim().pipe(z.email('Invalid email address')),
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters'),
  username: z
    .string()
    .trim()
    .min(5, 'Username must be at least 5 characters')
    .max(20, 'Username cannot exceed 20 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
