import { type IToDomainMapper } from '@forumate/core/application';

import { PostContent } from '../../domain/value-objects/post-content';

class PostContentMapper implements IToDomainMapper<string, PostContent> {
  toDomain(value: string): PostContent {
    return PostContent.reconstitute(value);
  }
}

export const PostContentMap = new PostContentMapper();
