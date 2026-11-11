import { ApiClient, MemberDto } from '@forumate/api';

import { CreatePostInputBuilder } from '../../builders/inputs/post-input-builders';

interface SetupPostOptions {
  apiClient: ApiClient;
  member: MemberDto;
  authToken: string;
}

/**
 * E2E test scenario helper: creates a text post via the real API, on
 * behalf of an already-existing member.
 *
 * @param options.apiClient - HTTP client used to call the live API under test.
 * @param options.member - Existing member who will author the post. Must
 *   already be persisted (e.g. via `databaseFixture.seedMember` or
 *   `setupLevelXMember`) and satisfy `CanCreatePostPolicy`.
 * @param options.authToken - Auth token for `member`, used to authenticate
 *   the create-post request.
 *
 * @returns `{ post, postInput }` — the created post as returned by the
 *   API, and the exact input that was sent to create it (useful for
 *   asserting against, rather than duplicating literal values in tests).
 *
 * @throws If the API call fails (e.g. the member lacks permission, or
 *   validation fails), or if the response is missing expected fields —
 *   surfaces the API's error code/message to make test failures easy to
 *   diagnose.
 *
 * @example
 * const member = await databaseFixture.seedMember({ reputationLevel: ReputationLevelValue.Level2 });
 * const { post, postInput } = await setupPost({ apiClient, member, authToken: token });
 * expect(post.title).toBe(postInput.title);
 */
export async function setupPost({
  apiClient,
  member,
  authToken,
}: SetupPostOptions) {
  const postInput = CreatePostInputBuilder.aTextPost()
    .withMemberId(member.id)
    .build();

  const response = await apiClient.posts.create(postInput, authToken);

  if (!response.success) {
    throw new Error(
      `Failed to create post: ${response.error.code} - ${response.error.message}`,
    );
  }

  expect(response.data?.id).toBeDefined();
  expect(response.data?.slug).toBeDefined();

  return { post: response.data, postInput };
}
