import { createApiClient } from '@forumate/api';
import { memberErrorCodes } from '@forumate/errors/domain';

import { CompositionRoot } from '../../../src/shared/composition-root';
import { Config } from '../../../src/shared/config';
import { httpStatus } from '../../../src/shared/infra/http/http-status';
import { CreateTextPostInputBuilder } from '../../builders/inputs/post-input-builders';
import { DatabaseFixture } from '../../fixtures/e2e/database';
import { setupLevel1Member } from '../../fixtures/e2e/members';
import { createFakeIdToken } from '../../fixtures/e2e/users';

jest.setTimeout(30000);

describe('posts', () => {
  let appComposition: CompositionRoot;
  let databaseFixture: DatabaseFixture;

  const apiClient = createApiClient({ baseURL: process.env.API_URL });

  beforeAll(async () => {
    const config: Config = new Config('test:e2e');
    appComposition = CompositionRoot.createCompositionRoot(config);
    databaseFixture = new DatabaseFixture(appComposition);

    await appComposition.start();
  });

  afterEach(async () => {
    await databaseFixture.resetDatabase();
  });

  afterAll(async () => {
    await appComposition.stop();
  });

  describe('identity & permissions', () => {
    it('should not be able to create a post if they are level 1', async () => {
      const { token, userId } = await createFakeIdToken();

      const { member } = await setupLevel1Member(apiClient, token, userId);

      const postInput = new CreateTextPostInputBuilder()
        .withMemberId(member.memberId)
        .build();

      const response = await apiClient.posts.create(postInput, token);

      expect(response.success).toBe(false);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
      expect(response.data).toBe(null);
      expect(response.error?.code).toBe(
        memberErrorCodes.INSUFFICIENT_MEMBER_LEVEL,
      );
      expect(response.error?.message).toBeDefined();
    });
  });

  describe.skip('creating new posts', () => {
    it('as a level 2 member, it can create a link post', async () => {
      // Implement
      throw new Error('Not yet implemented');
    });

    it('should have an initial upvote when creating a post', async () => {
      // Implement
      throw new Error('Not yet implemented');
    }, 15000); // Set test timeout to 15 seconds

    it('cannot create a link post without supplying a link', async () => {
      // Implement
      throw new Error('Not yet implemented');
    });

    it('cannot create a text post without supplying content', async () => {
      // Implement
      throw new Error('Not yet implemented');
    });
  });

  describe.skip('fetching posts', () => {
    it('can fetch a previously created post by id', async () => {
      // Implement
      throw new Error('Not yet implemented');
    });

    it('returns a not found error if the post does not exist', async () => {
      // Implement
      throw new Error('Not yet implemented');
    });

    it('can fetch recent posts', () => {
      // Not yet implemented
      throw new Error('Not yet implemented');
    });

    it('can fetch "popular" posts', () => {
      // Not yet implemented
      throw new Error('Not yet implemented');
    });
  });

  describe.skip('incentives for posting / membership updates', () => {
    it('should trigger a member reputation upgrade if the member posts 5 posts, going from level 2 to level 3', async () => {
      // Implement
      throw new Error('Not yet implemented');
    }, 20000);
  });
});
