import { type IToDomainMapper } from '@forumate/core/application';

import { PostLink } from '../../domain/value-objects/post-link';

class PostLinkMapper implements IToDomainMapper<string, PostLink> {
  toDomain(value: string): PostLink {
    return PostLink.reconstitute(value);
  }
}

export const PostLinkMap = new PostLinkMapper();
