import { z } from 'zod';

import { type Result } from '@forumate/core/application';
import { ValueObject } from '@forumate/core/domain';

import { parseWithSchema } from '../../../../shared/validation/parse-with-schema';
import { InvalidPostTypeError } from '../errors/posts-errors';

export const postTypeSchema = z.enum(
  ['text', 'link'],
  'Post type must be either text or link',
);

export type PostTypeValue = z.infer<typeof postTypeSchema>;

type PostTypeProps = {
  value: PostTypeValue;
};

export class PostType extends ValueObject<PostTypeProps> {
  private constructor(props: PostTypeProps) {
    super(props);
  }

  get value(): PostTypeValue {
    return this.props.value;
  }

  public static create(
    input: PostTypeValue,
  ): Result<PostType, InvalidPostTypeError> {
    return parseWithSchema(
      postTypeSchema,
      input,
      (message) => new InvalidPostTypeError(message),
      (data) => new PostType({ value: data }),
    );
  }

  public static reconstitute(value: PostTypeValue) {
    return new PostType({ value });
  }
}
