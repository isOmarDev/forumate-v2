import z from 'zod';

import { ValueObject, Result } from '@forumate/core';

import { parseWithSchema } from '../../../../shared/validation/parse-with-schema';
import { InvalidPostTitleError } from '../errors/posts-errors';

const postTitleSchema = z
  .string()
  .min(5, 'Post title must be at least 5 characters')
  .max(100, 'Post title must not exceed 100 characters');

type PostTitleProps = {
  value: string;
};

export class PostTitle extends ValueObject<PostTitleProps> {
  private constructor(props: PostTitleProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  public static create(
    input: string,
  ): Result<PostTitle, InvalidPostTitleError> {
    return parseWithSchema(
      postTitleSchema,
      input,
      (message) => new InvalidPostTitleError(message),
      (data) => new PostTitle({ value: data }),
    );
  }

  public static reconstitute(value: string): PostTitle {
    return new PostTitle({ value });
  }
}
