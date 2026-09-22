import { IToDomainMapper, IToPersistenceMapper } from '@forumate/core';
import { type PostModel } from '@forumate/database';

import {
  Post,
  type BasePostProps,
  type PostProps,
} from '../../domain/entities/post';

import { PostSlugMap } from './post-slug-map';

type PostPersistence = Omit<PostModel, 'dateCreated' | 'lastUpdated'>;

class PostMapper
  implements
    IToDomainMapper<PostModel, Post>,
    IToPersistenceMapper<Post, PostPersistence>
{
  toDomain(persistence: PostModel): Post {
    const base: BasePostProps = {
      id: persistence.id,
      memberId: persistence.memberId,
      title: persistence.title,
      voteScore: persistence.voteScore,
      slug: PostSlugMap.toDomain(persistence.slug),
    };

    const postProps: PostProps =
      persistence.postType === 'link'
        ? {
            ...base,
            postType: 'link',
            link: persistence.link!,
          }
        : {
            ...base,
            postType: 'text',
            content: persistence.content!,
          };

    return Post.reconstitute(postProps);
  }

  toPersistence(domain: Post): PostPersistence {
    if (domain.postType === 'link') {
      return {
        id: domain.id,
        memberId: domain.memberId,
        postType: 'link',
        title: domain.title,
        link: domain.link ?? null,
        content: null,
        slug: domain.slug.value,
        voteScore: domain.voteScore,
      };
    }

    return {
      id: domain.id,
      memberId: domain.memberId,
      postType: 'text',
      title: domain.title,
      content: domain.content ?? null,
      link: null,
      slug: domain.slug.value,
      voteScore: domain.voteScore,
    };
  }
}

export const PostMap = new PostMapper();
