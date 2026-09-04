import { PostCommentCommand } from '@forumate/api';
import { InMemoryEventBus } from '@forumate/bus';
import { PrismaDatabase } from '@forumate/database';

import { setupTestWithLevel1Member } from '../../../../../../tests/fixtures/unit/members';
import { withExistingPostByRandomMember } from '../../../../../../tests/fixtures/unit/posts';
import { Config } from '../../../../../shared/config';
import { ProductionMembersRepository } from '../../../../members/repos/adapters/production-members-repository';
import { ProductionPostsRepository } from '../../../../posts/repos/adapters/production-posts-repository';
import { Comment } from '../../../domain/entities/comment';
import { CommentPosted } from '../../../domain/events/comment-posted';
import { PrismaCommentsRepository } from '../../../infrastructure/repositories/prisma-comment-repository';

import { PostComment } from './post-comment';

describe('postComment', () => {
  const config = new Config('test:unit');
  const database = new PrismaDatabase();
  const commentsRepo = new PrismaCommentsRepository(database);
  const postsRepo = new ProductionPostsRepository(database);
  const membersRepo = new ProductionMembersRepository(database);
  const eventBus = new InMemoryEventBus();
  const useCase = new PostComment(
    commentsRepo,
    postsRepo,
    membersRepo,
    eventBus,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('permissions & identity', () => {
    test('as a level 1 member, I should be able to post a comment', async () => {
      // Implement
      throw new Error('Not yet implemented');
    });
  });

  describe('posting comments', () => {
    test('if the member does not exist, the comment should not be created', async () => {
      // Implement
      throw new Error('Not yet implemented');
    });

    test('if the post was not found, the comment should not be created', async () => {
      // Implement
      throw new Error('Not yet implemented');
    });
  });

  describe('comment validation', () => {
    test('should not allow empty comments', async () => {
      // Implement
      throw new Error('Not yet implemented');
    });

    test('should not allow comments exceeding 1000 characters', async () => {
      // Implement
      throw new Error('Not yet implemented');
    });
  });
});
