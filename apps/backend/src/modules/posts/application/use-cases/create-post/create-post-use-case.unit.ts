import { Commands } from '@forumate/api/posts';
import { InMemoryEventBus } from '@forumate/bus';
import { PrismaDatabase } from '@forumate/database';

import {
  setupTestWithLevel1Member,
  setupTestWithLevel2Member,
} from '../../../../../../tests/fixtures/unit/members';
import { Config } from '../../../../../shared/config';
import { PrismaMembersRepository } from '../../../../members/infrastructure/repositories/prisma-members-repository';
import { PrismaPostsRepository } from '../../../infrastructure/repositories/prisma-posts-repository';

import { CreatePostUseCase } from './create-post-use-case';

describe('createPost', () => {
  const config = new Config('test:unit');
  const database = new PrismaDatabase();

  const membersRepo = new PrismaMembersRepository(database);
  const postsRepo = new PrismaPostsRepository(database);
  const eventBus = new InMemoryEventBus();

  const useCase = new CreatePostUseCase(postsRepo, membersRepo, eventBus);

  describe('permissions & identity', () => {
    test('if the member was not found, they should not be able to create the post', async () => {
      // Implement!
      throw new Error('To be implemented');
    });

    test('as a level 1 member, I should not be able to create a new post', async () => {
      // Implement!
      throw new Error('To be implemented');
    });

    test('as a level 2 member, I should be able to create a new post', async () => {
      // Implement!
      throw new Error('To be implemented');
    });
  });

  describe('text posts', () => {
    test('as a level 2 member, I should be able to create a new text post with valid post details', async () => {
      // Implement!
      throw new Error('To be implemented');
    });

    test.each([
      { title: '', content: '' },
      { title: 'A', content: 'sdsd' },
      { title: 'Title! Looks good. But no content.', content: '' },
      { title: 'Another', content: '2' },
    ])(
      'as a level 2 member, I should not be able to create a text post with invalid title or content: %o',
      async ({ title, content }) => {
        // Implement!
        throw new Error('To be implemented');
      },
    );
  });

  describe('link posts', () => {
    test('as a level 2 member, I should be able to create a new link post with valid post details', async () => {
      // Implement!
      throw new Error('To be implemented');
    });

    test.each([
      { title: 'A new post', link: '' },
      { title: 'A new post', link: 'invalid-url' },
      { title: 'A new post', link: 'www.google.com' }, // Assuming the link should be a full URL with http/https
    ])(
      'as a level 2 member, I should not be able to create a link post with an invalid link: %o',
      async ({ title, link }) => {
        // Implement!
        throw new Error('To be implemented');
      },
    );
  });

  describe('default votes', () => {
    test('as a level 2 member, when creating a new post, the post should have 1 upvote by me', async () => {
      // We can only test this in the integration test, because the vote is created in the domain event
      // No need to implement.
    });
  });
});
