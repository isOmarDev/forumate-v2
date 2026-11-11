import { randomUUID } from 'node:crypto';

import { Post } from '../../../src/modules/posts/domain/entities/post';
import {
  PostContent,
  PostTitle,
  PostType,
} from '../../../src/modules/posts/domain/value-objects';
import { InMemoryPostsRepository } from '../../../src/modules/posts/infrastructure/repositories/in-memory/in-memory-posts-repository';
import { CreatePostInputBuilder } from '../../builders/inputs/post-input-builders';

export function setupPostByRandomMember(
  repositorySpy: InMemoryPostsRepository,
) {
  const input = CreatePostInputBuilder.aTextPost().build();

  const postOrError = Post.create({
    memberId: randomUUID(),
    title: PostTitle.create(input.title).getValue(),
    content: PostContent.create(input.content).getValue(),
    postType: PostType.create(input.postType).getValue(),
  });

  const post = postOrError.getValue();

  repositorySpy.seed(post);

  return post;
}
