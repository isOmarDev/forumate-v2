import { PostCommentCommand } from '@forumate/api';
import { type IEventBus, InMemoryEventBus } from '@forumate/bus';
import {
  commentErrorCodes,
  memberErrorCodes,
  postErrorCodes,
} from '@forumate/errors/domain';
import {
  InvalidRequestInputError,
  requestErrorCodes,
} from '@forumate/errors/request';

import { PostCommentInputBuilder } from '../../../../../../tests/builders/inputs/comment-input-builder';
import { setupLevel1Member } from '../../../../../../tests/fixtures/unit/members';
import { setupPostByRandomMember } from '../../../../../../tests/fixtures/unit/posts';
import { MemberNotFoundError } from '../../../../members/domain/errors/member-errors';
import { InMemoryMembersRepository } from '../../../../members/infrastructure/repositories/in-memory-members-repository';
import { PostNotFoundError } from '../../../../posts/domain/errors/posts-errors';
import { InMemoryPostsRepository } from '../../../../posts/infrastructure/repositories/in-memory-posts-repository';
import { Comment } from '../../../domain/entities/comment';
import { InvalidCommentBodyError } from '../../../domain/errors/comment-errors';
import { CommentPosted } from '../../../domain/events/comment-posted';
import { CommentBody } from '../../../domain/value-objects/comment-body';
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

  describe('permissions & identity', () => {
    it('should create comment as a level 1 member', async () => {
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
    it('should not create comment, if the member does not exist', async () => {
      const existingPost = setupPostByRandomMember(postsRepositorySpy);

      const input = new PostCommentInputBuilder()
        .withPostId(existingPost.id)
        .build();

      const command = PostCommentCommand.create(input);
      expect(command.isSuccess).toBe(true);

      const result = await postCommentUseCase.execute(command.getValue());
      expect(result.isSuccess).toBe(false);
      expect(result.getError()).toBeInstanceOf(MemberNotFoundError);
      expect(result.getError().code).toBe(memberErrorCodes.MEMBER_NOT_FOUND);

      expect(commentsRepositorySpy.wasMethodCalled('save')).toBe(false);
      expect(publishEventsSpy).not.toHaveBeenCalled();
    });

    it('should not create comment, if the post does not exist', async () => {
      const level1Member = setupLevel1Member(membersRepositorySpy);
      const input = new PostCommentInputBuilder()
        .withMemberId(level1Member.id)
        .build();

      const command = PostCommentCommand.create(input);
      expect(command.isSuccess).toBe(true);

      const result = await postCommentUseCase.execute(command.getValue());
      expect(result.isSuccess).toBe(false);
      expect(result.getError()).toBeInstanceOf(PostNotFoundError);
      expect(result.getError().code).toBe(postErrorCodes.POST_NOT_FOUND);

      expect(commentsRepositorySpy.wasMethodCalled('save')).toBe(false);
      expect(publishEventsSpy).not.toHaveBeenCalled();
    });
  });

  describe('comment validation', () => {
    it('should not create a comment if the body is empty', async () => {
      const level1Member = setupLevel1Member(membersRepositorySpy);
      const existingPost = setupPostByRandomMember(postsRepositorySpy);

      const input = new PostCommentInputBuilder()
        .withMemberId(level1Member.id)
        .withPostId(existingPost.id)
        .withBody('')
        .build();

      const command = PostCommentCommand.create(input);

      expect(command.isSuccess).toBe(false);
      expect(command.getError()).toBeInstanceOf(InvalidRequestInputError);
      expect(command.getError().code).toBe(
        requestErrorCodes.INVALID_REQUEST_INPUT,
      );

      expect(commentsRepositorySpy.wasMethodCalled('save')).toBe(false);
      expect(publishEventsSpy).not.toHaveBeenCalled();
    });

    it('should not create comment if body is exceeding 1000 characters', async () => {
      const level1Member = setupLevel1Member(membersRepositorySpy);
      const existingPost = setupPostByRandomMember(postsRepositorySpy);

      const input = new PostCommentInputBuilder()
        .withMemberId(level1Member.id)
        .withPostId(existingPost.id)
        .withBody('a'.repeat(CommentBody.MAX_LENGTH + 1))
        .build();

      const command = PostCommentCommand.create(input);
      expect(command.isSuccess).toBe(true);

      const result = await postCommentUseCase.execute(command.getValue());
      expect(result.isSuccess).toBe(false);
      expect(result.getError()).toBeInstanceOf(InvalidCommentBodyError);
      expect(result.getError().code).toBe(
        commentErrorCodes.INVALID_COMMENT_BODY,
      );

      expect(commentsRepositorySpy.wasMethodCalled('save')).toBe(false);
      expect(publishEventsSpy).not.toHaveBeenCalled();
    });
  });
});
