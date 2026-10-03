import { PostCommentUseCase } from '../../../src/modules/comments/application/use-cases';
import { Post } from '../../../src/modules/posts/domain/entities/post';
import {
  PostContent,
  PostTitle,
  PostType,
} from '../../../src/modules/posts/domain/value-objects';

export function withExistingPostByRandomMember(useCase: PostCommentUseCase) {
  const postOrError = Post.create({
    memberId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
    title: PostTitle.create('Test Post').getValue(),
    content: PostContent.create('This is a test post').getValue(),
    postType: PostType.create('text').getValue(),
  });

  const existingPost = postOrError.getValue();

  expect(existingPost instanceof Post).toBe(true);

  useCase['postsRepository'].getPostById = jest
    .fn()
    .mockResolvedValue(existingPost as Post);

  return existingPost as Post;
}
