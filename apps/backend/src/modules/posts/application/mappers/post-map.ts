import { IToDomainMapper, IToPersistenceMapper } from '@forumate/core';
import { Persistence, type PostModel } from '@forumate/database';

import {
  Post,
  type BasePostProps,
  type PostProps,
} from '../../domain/entities/post';

import { PostContentMap } from './post-content-map';
import { PostLinkMap } from './post-link-map';
import { PostSlugMap } from './post-slug-map';
import { PostTitleMap } from './post-title-map';

type PostPersistence = Persistence<PostModel>;

class PostMapper
  implements
    IToDomainMapper<PostModel, Post>,
    IToPersistenceMapper<Post, PostPersistence>
{
  toDomain(persistence: PostModel): Post {
    const base: BasePostProps = {
      id: persistence.id,
      memberId: persistence.memberId,
      title: PostTitleMap.toDomain(persistence.title),
      voteScore: persistence.voteScore,
      slug: PostSlugMap.toDomain(persistence.slug),
    };

    const postProps: PostProps =
      persistence.postType === 'text'
        ? {
            ...base,
            postType: 'text',
            content: PostContentMap.toDomain(persistence.content!),
          }
        : {
            ...base,
            postType: 'link',
            link: PostLinkMap.toDomain(persistence.link!),
          };

    return Post.reconstitute(postProps);
  }

  toPersistence(domain: Post): PostPersistence {
    const base = {
      id: domain.id,
      memberId: domain.memberId,
      title: domain.title.value,
      slug: domain.slug.value,
      voteScore: domain.voteScore,
    };

    switch (domain.postType) {
      case 'text':
        return {
          ...base,
          postType: domain.postType,
          content: domain.content.value,
          link: null,
        };

      case 'link':
        return {
          ...base,
          postType: domain.postType,
          link: domain.link.value,
          content: null,
        };

      default: {
        const _exhaustiveCheck: never = domain.postType;
        throw new Error(`Unhandled post type: ${_exhaustiveCheck}`);
      }
    }
  }
}

export const PostMap = new PostMapper();
