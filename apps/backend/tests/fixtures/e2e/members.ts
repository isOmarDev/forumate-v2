import { randomUUID } from 'node:crypto';

import { ApiClient } from '@forumate/api';

import {
  LEVEL_2_MIN_SCORE,
  reputationLevel,
} from '../../../src/modules/members/domain/value-objects/member-reputation-level';
import { CreateMemberInputBuilder } from '../../builders/inputs/member-input-builders';
import { waitFor } from '../../helpers/wait-for';

import { DatabaseFixture } from './database';

const VOTES_REQUIRED_FOR_LEVEL_2 = LEVEL_2_MIN_SCORE;

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
  const { member: level1Member } = await setupLevel1Member({
    apiClient,
    authToken,
    userId,
  });

  const postAuthor = await databaseFixture.seedMember({
    reputationLevel: reputationLevel.level2,
    reputationScore: LEVEL_2_MIN_SCORE,
  });
  const post = await databaseFixture.seedPost({ memberId: postAuthor.id });

  for (let i = 1; i <= VOTES_REQUIRED_FOR_LEVEL_2; i++) {
    const response = await apiClient.comments.postComment(
      { postId: post.id, memberId: level1Member.id, body: `Test comment ${i}` },
      authToken,
    );

    if (!response.success) {
      throw new Error(
        `Failed to post comment ${i}/${VOTES_REQUIRED_FOR_LEVEL_2}: ${response.error.message}`,
      );
    }

    const voteResponse = await apiClient.votes.voteOnComment(
      {
        memberId: postAuthor.id,
        commentId: response.data.id,
        voteType: 'upvote',
      },
      randomUUID(),
    );

    if (!voteResponse.success) {
      throw new Error(voteResponse.error.message);
    }
  }

  await waitFor(async () => {
    const updatedMember = await databaseFixture.getMemberById(level1Member.id);
    return updatedMember?.reputationLevel === reputationLevel.level2;
  });

  return { member: level1Member };
}
