import { type IToDomainMapper } from '@forumate/core/application';

import { PostSlug } from '../../domain/value-objects/post-slug';

class PostSlugMapper implements IToDomainMapper<string, PostSlug> {
  toDomain(persistence: string): PostSlug {
    return PostSlug.reconstitute(persistence);
  }
}

export const PostSlugMap = new PostSlugMapper();
