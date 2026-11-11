import { type IToDomainMapper } from '@forumate/core/application';

import { PostTitle } from '../../domain/value-objects/post-title';

class PostTitleMapper implements IToDomainMapper<string, PostTitle> {
  toDomain(value: string): PostTitle {
    return PostTitle.reconstitute(value);
  }
}

export const PostTitleMap = new PostTitleMapper();
