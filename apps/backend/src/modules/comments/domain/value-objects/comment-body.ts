import { Result, success, fail } from '@forumate/core/application';
import { ValueObject } from '@forumate/core/domain';

import { InvalidCommentBodyError } from '../errors/comment-errors';

interface CommentBodyProps {
  value: string;
}

export class CommentBody extends ValueObject<CommentBodyProps> {
  public static MAX_LENGTH = 1000;

  private constructor(props: CommentBodyProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  public static create(
    value: string,
  ): Result<CommentBody, InvalidCommentBodyError> {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return fail(new InvalidCommentBodyError('Comment body cannot be empty'));
    }

    if (trimmed.length > CommentBody.MAX_LENGTH) {
      return fail(
        new InvalidCommentBodyError(
          `Comment body cannot exceed ${CommentBody.MAX_LENGTH} characters`,
        ),
      );
    }

    return success(new CommentBody({ value }));
  }

  public static reconstitute(value: string): CommentBody {
    return new CommentBody({ value });
  }
}
