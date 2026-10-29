import z from 'zod';

export const postTypeSchema = z.enum(['text', 'link']);
export type PostType = z.infer<typeof postTypeSchema>;
