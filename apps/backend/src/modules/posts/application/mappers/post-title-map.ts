import { type IToDomainMapper } from '@forumate/core/application';

import { PostTitle } from '../../domain/value-objects/post-title';

class PostTitleMapper implements IToDomainMapper<string, PostTitle> {
  toDomain(persistence: string): PostTitle {
    return PostTitle.reconstitute(persistence);
  }
}

export const PostTitleMap = new PostTitleMapper();
