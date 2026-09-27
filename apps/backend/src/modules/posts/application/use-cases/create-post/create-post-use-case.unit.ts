import { CreatePostCommand } from '@forumate/api';
import { type IEventBus, InMemoryEventBus } from '@forumate/bus';
import { memberErrorCodes } from '@forumate/errors';

import { CreateTextPostInputBuilder } from '../../../../../../tests/builders/inputs/post-input-builders';
import { setupLevel1Member } from '../../../../../../tests/fixtures/unit/members';
import { InsufficientMemberLevelError } from '../../../../members/domain/errors/member-errors';
import { InMemoryMembersRepository } from '../../../../members/infrastructure/repositories/in-memory-members-repository';
import { InMemoryPostsRepository } from '../../../infrastructure/repositories/in-memory-posts-repository';

import { CreatePostUseCase } from './create-post-use-case';

describe('createPost', () => {
  let createPostUseCase: CreatePostUseCase;
  let postsRepositorySpy: InMemoryPostsRepository;
  let membersRepositorySpy: InMemoryMembersRepository;
  let eventBus: IEventBus;

  beforeEach(() => {
    postsRepositorySpy = new InMemoryPostsRepository();
    membersRepositorySpy = new InMemoryMembersRepository();
    eventBus = new InMemoryEventBus();

    createPostUseCase = new CreatePostUseCase(
      postsRepositorySpy,
      membersRepositorySpy,
      eventBus,
    );
  });

  afterEach(() => {
    postsRepositorySpy.reset();
    membersRepositorySpy.reset();
    eventBus.clear();
  });

  describe('permissions & identity', () => {
    test.only('as a level 1 member, I should not be able to create a new post', async () => {
      const level1Member = setupLevel1Member(membersRepositorySpy);
      const eventBusSpy = jest.spyOn(eventBus, 'publishEvents');

      const textPostInput = new CreateTextPostInputBuilder()
        .withMemberId(level1Member.id)
        .build();
      const commandOrError = CreatePostCommand.create(textPostInput);
      const result = await createPostUseCase.execute(commandOrError.getValue());

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBeInstanceOf(InsufficientMemberLevelError);
      expect(result.getError().code).toBe(
        memberErrorCodes.INSUFFICIENT_MEMBER_LEVEL,
      );
      expect(result.getError().message).toBeDefined();

      expect(postsRepositorySpy.getTimesMethodCalled('save')).toBe(0);
      expect(eventBusSpy).not.toHaveBeenCalled();
    });

    test('as a level 2 member, I should be able to create a new post', async () => {
      // Implement!
      throw new Error('To be implemented');
    });

    test('if the member was not found, they should not be able to create the post', async () => {
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
