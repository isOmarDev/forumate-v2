import { randomUUID } from 'node:crypto';

import { createApiClient } from '@forumate/api';
import { memberErrorCodes, postErrorCodes } from '@forumate/errors/domain';

import { CompositionRoot } from '../../../src/shared/composition-root';
import { Config } from '../../../src/shared/config';
import { httpStatus } from '../../../src/shared/infra/http/http-status';
import { CreatePostInputBuilder } from '../../builders/inputs/post-input-builders';
import { DatabaseFixture } from '../../fixtures/e2e/database';
import {
  setupLevel1Member,
  setupLevel2Member,
} from '../../fixtures/e2e/members';
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
      const { authToken, userId } = await createFakeIdToken();

      const { member } = await setupLevel1Member({
        apiClient,
        authToken,
        userId,
      });

      const postInput = CreatePostInputBuilder.aTextPost()
        .withMemberId(member.id)
        .build();

      const response = await apiClient.posts.create(postInput, authToken);

      expect(response.success).toBe(false);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
      expect(response.data).toBe(null);
      expect(response.error?.code).toBe(
        memberErrorCodes.INSUFFICIENT_MEMBER_LEVEL,
      );
      expect(response.error?.message).toBeDefined();
    });
  });

  describe.only('creating new posts', () => {
    it.only('it should create a link post as a level 2 member', async () => {
      const { authToken, userId } = await createFakeIdToken();

      const { member } = await setupLevel2Member({
        apiClient,
        authToken,
        userId,
        databaseFixture,
      });

      const postInput = CreatePostInputBuilder.aLinkPost()
        .withMemberId(member.id)
        .build();

      const response = await apiClient.posts.create(postInput, authToken);

      expect(response.success).toBe(true);
      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.data).toBeDefined();
      expect(response.data?.id).toBeDefined();
      expect(response.error).toBe(null);

      const createdPost = await databaseFixture.getPostById(response.data!.id);

      expect(createdPost?.postType).toBe('link');
      expect(createdPost?.link).toBe(postInput.link);
      expect(createdPost?.content).toBeNull();
      expect(createdPost?.memberId).toBe(member.id);
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

  describe.only('fetching posts', () => {
    it('can fetch a previously created post by id', async () => {
      const member = await databaseFixture.seedMember();
      const post = await databaseFixture.seedPost({
        memberId: member.id,
        postType: 'text',
      });

      const response = await apiClient.posts.getPostById(post.id);

      expect(response.success).toBe(true);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.error).toBe(null);
      expect(response.data).toMatchObject({
        id: post.id,
        member: { id: member.id },
        title: post.title,
        content: post.content,
        postType: post.postType,
      });
    });

    it('returns a not found error if the post does not exist', async () => {
      const nonExistentPostId = randomUUID();

      const response = await apiClient.posts.getPostById(nonExistentPostId);

      expect(response.success).toBe(false);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
      expect(response.data).toBe(null);
      expect(response.error?.code).toBe(postErrorCodes.POST_NOT_FOUND);
      expect(response.error?.message).toBeDefined();
    });

    it('can fetch "recent" posts', () => {
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
