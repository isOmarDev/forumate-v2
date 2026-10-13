import { type IToDomainMapper } from '@forumate/core/application';

import { CommentBody } from '../../domain/value-objects/comment-body';

class CommentBodyMapper implements IToDomainMapper<string, CommentBody> {
  public toDomain(value: string): CommentBody {
    return CommentBody.reconstitute(value);
  }
}

export const CommentBodyMap = new CommentBodyMapper();
