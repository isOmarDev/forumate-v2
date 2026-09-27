import { type IToDomainMapper } from '@forumate/core/application';

import { PostLink } from '../../domain/value-objects/post-link';

class PostLinkMapper implements IToDomainMapper<string, PostLink> {
  toDomain(persistence: string): PostLink {
    return PostLink.reconstitute(persistence);
  }
}

export const PostLinkMap = new PostLinkMapper();
