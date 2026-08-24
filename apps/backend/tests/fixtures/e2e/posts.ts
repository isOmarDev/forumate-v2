import { ApiClient, CreatePostInput, MemberDto, PostDto } from '@forumate/api';

export async function setupPost(
  apiClient: ApiClient,
  member: MemberDto,
  authToken: string,
) {
  const postData: CreatePostInput = {
    memberId: member.memberId,
    title: 'A new post',
    postType: 'text',
    content: 'This is a new text post that I am creating!',
  };

  const response = await apiClient.posts.create(postData, authToken);

  expect(response).toBeDefined();
  expect(response.success).toBe(true);
  return { post: response.data as PostDto };
}
