import { PostCommentCommand } from '@forumate/api';
import { type IEventBus, InMemoryEventBus } from '@forumate/bus';

import { PostCommentInputBuilder } from '../../../../../../tests/builders/inputs/comment-input-builder';
import { setupLevel1Member } from '../../../../../../tests/fixtures/unit/members';
import { setupPostByRandomMember } from '../../../../../../tests/fixtures/unit/posts';
import { InMemoryMembersRepository } from '../../../../members/infrastructure/repositories/in-memory-members-repository';
import { InMemoryPostsRepository } from '../../../../posts/infrastructure/repositories/in-memory-posts-repository';
import { Comment } from '../../../domain/entities/comment';
import { CommentPosted } from '../../../domain/events/comment-posted';
import { InMemoryCommentsRepository } from '../../../infrastructure/repositories/in-memory-comments-repository';

import { PostCommentUseCase } from './post-comment-use-case';

describe('postComment', () => {
  let postCommentUseCase: PostCommentUseCase;
  let commentsRepositorySpy: InMemoryCommentsRepository;
  let postsRepositorySpy: InMemoryPostsRepository;
  let membersRepositorySpy: InMemoryMembersRepository;
  let eventBus: IEventBus;
  let publishEventsSpy: jest.SpyInstance;

  beforeEach(() => {
    commentsRepositorySpy = new InMemoryCommentsRepository();
    postsRepositorySpy = new InMemoryPostsRepository();
    membersRepositorySpy = new InMemoryMembersRepository();
    eventBus = new InMemoryEventBus();
    publishEventsSpy = jest.spyOn(eventBus, 'publishEvents');

    postCommentUseCase = new PostCommentUseCase(
      commentsRepositorySpy,
      postsRepositorySpy,
      membersRepositorySpy,
      eventBus,
    );
  });

  describe.only('permissions & identity', () => {
    test('as a level 1 member, I should be able to post a comment', async () => {
      const existingPost = setupPostByRandomMember(postsRepositorySpy);
      const existingLevel1Member = setupLevel1Member(membersRepositorySpy);

      const input = new PostCommentInputBuilder()
        .withMemberId(existingLevel1Member.id)
        .withPostId(existingPost.id)
        .build();
      const command = PostCommentCommand.create(input);
      const result = await postCommentUseCase.execute(command.getValue());

      const comment = result.getValue();

      expect(result.isSuccess).toBe(true);
      expect(comment).toBeInstanceOf(Comment);

      expect(commentsRepositorySpy.getTimesMethodCalled('save')).toBe(1);
      expect(commentsRepositorySpy.getCalls()[0]?.args[0]).toBe(comment);

      expect(publishEventsSpy).toHaveBeenCalledTimes(1);
      const [publishedEvents] = publishEventsSpy.mock.calls[0];
      expect(publishedEvents).toHaveLength(1);

      const event = publishedEvents[0] as CommentPosted;
      expect(event).toBeInstanceOf(CommentPosted);
      expect(event.aggregateId).toBe(comment.id);
      expect(event.data.postId).toBe(existingPost.id);
      expect(event.data.memberId).toBe(existingLevel1Member.id);
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
