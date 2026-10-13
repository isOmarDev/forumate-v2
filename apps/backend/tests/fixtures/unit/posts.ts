import { randomUUID } from 'node:crypto';

import { Post } from '../../../src/modules/posts/domain/entities/post';
import {
  PostContent,
  PostTitle,
  PostType,
} from '../../../src/modules/posts/domain/value-objects';
import { InMemoryPostsRepository } from '../../../src/modules/posts/infrastructure/repositories/in-memory-posts-repository';

export function setupPostByRandomMember(
  repositorySpy: InMemoryPostsRepository,
) {
  const postOrError = Post.create({
    memberId: randomUUID(),
    title: PostTitle.create('Test Post').getValue(),
    content: PostContent.create('This is a test post').getValue(),
    postType: PostType.create('text').getValue(),
  });

  expect(postOrError.isSuccess).toBe(true);

  const post = postOrError.getValue();

  repositorySpy.seed(post);

  return post;
}
