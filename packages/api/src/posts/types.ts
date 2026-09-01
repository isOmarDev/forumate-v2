import z from 'zod';

export const PostTypeSchema = z.enum(['text', 'link']);
export type PostType = z.infer<typeof PostTypeSchema>;
