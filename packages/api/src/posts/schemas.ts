import { z } from 'zod';

export const createPostSchema = z
  .object({
    title: z.string().min(6, 'Title is required'),

    memberId: z.string(),

    content: z
      .string()
      .min(5, 'Content must be at least 5 characters')
      .optional(),

    link: z.url('Link must be a valid URL').optional(),

    postType: z.enum(['text', 'link']),
  })
  .refine(
    (data) => {
      if (data.postType === 'text' && !data.content) {
        return false;
      }

      if (data.postType === 'link' && !data.link) {
        return false;
      }

      return true;
    },
    {
      message: 'Content required for text posts, link required for link posts',
    },
  );
