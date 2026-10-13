import { type IToDomainMapper } from '@forumate/core/application';

import { PostSlug } from '../../domain/value-objects/post-slug';

class PostSlugMapper implements IToDomainMapper<string, PostSlug> {
  toDomain(value: string): PostSlug {
    return PostSlug.reconstitute(value);
  }
}

export const PostSlugMap = new PostSlugMapper();
