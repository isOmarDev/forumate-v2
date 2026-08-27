import { z } from 'zod';

import { type Request, Result } from '@forumate/core/application';
import {
  InvalidRequestBodyError,
  MissingRequestBodyError,
} from '@forumate/errors/request';

import type { CreatePostInput } from './inputs';
import { createPostSchema } from './schemas';

export class CreatePostCommand {
  private constructor(private readonly props: CreatePostInput) {}

  getProps(): CreatePostInput {
    return this.props;
  }

  static create(
    input: CreatePostInput,
  ): Result<
    CreatePostCommand,
    InvalidRequestBodyError | MissingRequestBodyError
  > {
    try {
      const result = createPostSchema.parse(input);

      return Result.success(new CreatePostCommand(result as CreatePostInput));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const invalidKeys = Object.keys(z.flattenError(error).fieldErrors);

        return Result.failure(new InvalidRequestBodyError(invalidKeys));
      }

      return Result.failure(new MissingRequestBodyError());
    }
  }

  static fromRequest(
    body: Request<CreatePostInput>['body'],
  ): Result<
    CreatePostCommand,
    InvalidRequestBodyError | MissingRequestBodyError
  > {
    const { title, postType, memberId } = body;

    if (!memberId) {
      return Result.failure(new InvalidRequestBodyError(['memberId']));
    }

    if (!title) {
      return Result.failure(new InvalidRequestBodyError(['title']));
    }

    if (!postType) {
      return Result.failure(new InvalidRequestBodyError(['postType']));
    }

    return this.create(body);
  }
}
