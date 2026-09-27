import { type IToDomainMapper } from '@forumate/core/application';

import { PostContent } from '../../domain/value-objects/post-content';

class PostContentMapper implements IToDomainMapper<string, PostContent> {
  toDomain(persistence: string): PostContent {
    return PostContent.reconstitute(persistence);
  }
}

export const PostContentMap = new PostContentMapper();
