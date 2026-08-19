import { z } from 'zod';

import { Request, Result } from '@forumate/core';
import { ValidationError } from '@forumate/errors/application';
import { MissingRequestParamsError } from '@forumate/errors/server';

import { CreatePostInput } from './inputs';

export class CreatePostCommand {
  private props: CreatePostInput;

  private constructor(props: CreatePostInput) {
    this.props = props;
  }

  getProps() {
    return this.props;
  }

  public static create(
    input: CreatePostInput,
  ): Result<CreatePostCommand, ValidationError> {
    const schema = z
      .object({
        title: z.string().min(6, 'Title is required'),
        memberId: z.string(),
        content: z
          .string()
          .min(5, 'Content must be at least 5 characters')
          .optional(),
        link: z.string().url('Link must be a valid URL').optional(),
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
          message:
            'Content required for text posts, link required for link posts',
        },
      );

    try {
      const result = schema.parse(input);
      return Result.success(new CreatePostCommand(result as CreatePostInput));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingKeys = error.errors
          .map((err) => err.path.join('.'))
          .join(', ');
        return Result.failure(
          new ValidationError(`Missing or invalid fields: ${missingKeys}`),
        );
      }
      return Result.failure(new ValidationError('Validation error'));
    }
  }

  public static fromRequest(
    body: Request['body'],
  ): Result<CreatePostCommand, MissingRequestParamsError> {
    const { title, postType, memberId } = body;

    if (!memberId) {
      return Result.failure(new MissingRequestParamsError(['memberId']));
    }

    if (!title) {
      return Result.failure(new MissingRequestParamsError(['title']));
    }

    if (!postType) {
      return Result.failure(new MissingRequestParamsError(['postType']));
    }

    return Result.success(new CreatePostCommand({ ...body }));
  }
}