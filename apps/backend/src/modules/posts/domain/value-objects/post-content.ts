import z from 'zod';

import { ValueObject, Result } from '@forumate/core';

import { parseWithSchema } from '../../../../shared/validation/parse-with-schema';
import { InvalidPostContentError } from '../errors/posts-errors';

const postContentSchema = z
  .string()
  .min(5, 'Post content must be at least 5 characters')
  .max(3000, 'Post content must not exceed 3000 characters');

type PostContentProps = {
  value: string;
};

export class PostContent extends ValueObject<PostContentProps> {
  private constructor(props: PostContentProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  public static create(
    input: string,
  ): Result<PostContent, InvalidPostContentError> {
    return parseWithSchema(
      postContentSchema,
      input,
      (message) => new InvalidPostContentError(message),
      (data) => new PostContent({ value: data }),
    );
  }

  public static reconstitute(value: string): PostContent {
    return new PostContent({ value });
  }
}
