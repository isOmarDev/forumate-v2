import { PostCommentUseCase } from '../../../src/modules/comments/application/use-cases';
import { Post } from '../../../src/modules/posts/domain/entities/post';

export function withExistingPostByRandomMember(useCase: PostCommentUseCase) {
  const existingPost = Post.create({
    memberId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
    title: 'Test Post',
    postType: 'text',
    content: 'This is a test post',
  });

  expect(existingPost instanceof Post).toBe(true);

  useCase['postsRepository'].getPostById = jest
    .fn()
    .mockResolvedValue(existingPost as Post);

  return existingPost as Post;
}
