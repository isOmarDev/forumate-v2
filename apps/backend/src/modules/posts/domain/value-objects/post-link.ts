import z from 'zod';

import { ValueObject, Result } from '@forumate/core';

import { parseWithSchema } from '../../../../shared/validation/parse-with-schema';
import { InvalidPostLinkError } from '../errors/posts-errors';

const postLinkSchema = z.url('Post link must be a valid URL');

type PostLinkProps = {
  value: string;
};

export class PostLink extends ValueObject<PostLinkProps> {
  private constructor(props: PostLinkProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  public static create(input: string): Result<PostLink, InvalidPostLinkError> {
    return parseWithSchema(
      postLinkSchema,
      input,
      (message) => new InvalidPostLinkError(message),
      (data) => new PostLink({ value: data }),
    );
  }

  public static reconstitute(value: string): PostLink {
    return new PostLink({ value });
  }
}
