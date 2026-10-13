import { ApiClient } from '@forumate/api';

import { ReputationLevel } from '../../../src/modules/members/domain/value-objects/member-reputation-level';
import { CreateMemberInputBuilder } from '../../builders/inputs/member-input-builders';
import { waitFor } from '../../helpers/wait-for';

import { DatabaseFixture } from './database';

const COMMENTS_REQUIRED_FOR_LEVEL_2 = 5;

interface SetupLevel1MemberOptions {
  apiClient: ApiClient;
  authToken: string;
  userId: string;
}

/**
 * E2E scenario helper: registers a new Level 1 member through the real
 * API, using a randomly generated username and email.
 *
 * @param options.apiClient - HTTP client for the API under test.
 * @param options.authToken - Auth token for the user being registered.
 * @param options.userId - User id the new member is linked to.
 * @returns `{ member }` - the member as returned by the API.
 * @throws If registration fails, or the response is missing expected fields.
 */
export async function setupLevel1Member({
  apiClient,
  authToken,
  userId,
}: SetupLevel1MemberOptions) {
  const { username, email } = new CreateMemberInputBuilder().build();

  const response = await apiClient.members.register(
    {
      username,
      email,
      userId,
    },
    authToken,
  );

  if (!response.success) {
    throw new Error(
      `Failed to create member: ${response.error.code} - ${response.error.message}`,
    );
  }

  expect(response.data).toBeDefined();
  expect(response.data?.id).toBeDefined();
  expect(response.data?.userId).toBeDefined();
  expect(response.data?.username).toBeDefined();

  return { member: response.data };
}

interface SetupLevel2MemberOptions {
  apiClient: ApiClient;
  authToken: string;
  userId: string;
  databaseFixture: DatabaseFixture;
}

/**
 * E2E scenario helper: creates a member and levels them up to Level 2 by
 * posting comments through the real API, then waits for the (async)
 * reputation update to land.
 *
 * Seeds its own post (authored by a separate member) to comment on, so it
 * doesn't depend on any pre-existing data.
 *
 * @param options.apiClient - HTTP client for the API under test.
 * @param options.authToken - Auth token for the member being created.
 * @param options.userId - User id the new member is linked to.
 * @param options.databaseFixture - Used to seed the post and poll the member's level.
 * @returns `{ member }` - the member as returned by `setupLevel1Member`
 *   (a snapshot from before leveling, so its reputation fields are stale).
 * @throws If a comment fails, or the member doesn't reach Level 2 in time.
 */
export async function setupLevel2Member({
  apiClient,
  authToken,
  userId,
  databaseFixture,
}: SetupLevel2MemberOptions) {
  const { member } = await setupLevel1Member({ apiClient, authToken, userId });

  const postAuthor = await databaseFixture.seedMember({
    reputationLevel: ReputationLevel.Level2,
  });
  const post = await databaseFixture.seedPost({ memberId: postAuthor.id });

  for (let i = 1; i <= COMMENTS_REQUIRED_FOR_LEVEL_2; i++) {
    const response = await apiClient.comments.postComment(
      { postId: post.id, memberId: member.id, body: `Test comment ${i}` },
      authToken,
    );

    if (!response.success) {
      throw new Error(
        `Failed to post comment ${i}/${COMMENTS_REQUIRED_FOR_LEVEL_2}: ${response.error.message}`,
      );
    }
  }

  await waitFor(async () => {
    const updatedMember = await databaseFixture.getMemberById(member.id);
    return updatedMember?.reputationLevel === ReputationLevel.Level2;
  });

  return { member };
}
