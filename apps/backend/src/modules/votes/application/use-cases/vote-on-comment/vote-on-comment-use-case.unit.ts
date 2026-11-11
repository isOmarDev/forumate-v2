import { VoteOnCommentCommand } from '@forumate/api';
import { IEventBus, InMemoryEventBus } from '@forumate/bus';

import { VoteInputBuilders } from '../../../../../../tests/builders/inputs/vote-input-builders';
import {
  setupComment,
  setupCommentWithInitialDownvote,
  setupCommentWithInitialUpvote,
} from '../../../../../../tests/fixtures/unit/comments';
import { setupLevel1Member } from '../../../../../../tests/fixtures/unit/members';
import { InMemoryCommentsRepository } from '../../../../comments/infrastructure/repositories/in-memory/in-memory-comments-repository';
import { InsufficientMemberLevelError } from '../../../../members/domain/errors/member-errors';
import { InMemoryMembersRepository } from '../../../../members/infrastructure/repositories/in-memory';
import { CommentVote } from '../../../domain/entities/comment-vote';
import { CommentDownvoted } from '../../../domain/events/comment-downvoted';
import { CommentUnvoted } from '../../../domain/events/comment-unvoted';
import { CommentUpvoted } from '../../../domain/events/comment-upvoted';
import { InMemoryCommentVotesRepository } from '../../../infrastructure/repositories/in-memory';

import { VoteOnCommentUseCase } from './vote-on-comment-use-case';

describe('voteOnComment', () => {
  let voteOnCommentUseCase: VoteOnCommentUseCase;
  let commentVotesRepositorySpy: InMemoryCommentVotesRepository;
  let membersRepositorySpy: InMemoryMembersRepository;
  let commentsRepositorySpy: InMemoryCommentsRepository;
  let eventBus: IEventBus;
  let publishEventsSpy: jest.SpyInstance;

  beforeEach(() => {
    commentVotesRepositorySpy = new InMemoryCommentVotesRepository();
    membersRepositorySpy = new InMemoryMembersRepository();
    commentsRepositorySpy = new InMemoryCommentsRepository();
    eventBus = new InMemoryEventBus();
    publishEventsSpy = jest.spyOn(eventBus, 'publishEvents');

    voteOnCommentUseCase = new VoteOnCommentUseCase(
      commentVotesRepositorySpy,
      membersRepositorySpy,
      commentsRepositorySpy,
      eventBus,
    );
  });

  describe('level 1 members voting on comments', () => {
    it('should not allow level 1 members to vote on comments other than their own', async () => {
      const level1Member = setupLevel1Member(membersRepositorySpy);
      const existingComment = setupComment(commentsRepositorySpy);

      const input = VoteInputBuilders.aCommentVote()
        .withCommentId(existingComment.id)
        .withMemberId(level1Member.id)
        .asUpvote()
        .build();
      const command = VoteOnCommentCommand.create(input);
      const result = await voteOnCommentUseCase.execute(command.getValue());

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBeInstanceOf(InsufficientMemberLevelError);

      expect(commentVotesRepositorySpy.getTimesMethodCalled('save')).toBe(0);
      expect(publishEventsSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('authors voting on their own comment', () => {
    it('should allow author to upvote their own comment', async () => {
      const author = setupLevel1Member(membersRepositorySpy);
      const existingComment = setupComment(commentsRepositorySpy, {
        memberId: author.id,
      });

      const input = VoteInputBuilders.aCommentVote()
        .withCommentId(existingComment.id)
        .withMemberId(author.id)
        .asUpvote()
        .build();
      const command = VoteOnCommentCommand.create(input);

      const result = await voteOnCommentUseCase.execute(command.getValue());
      const commentVote = result.getValue();

      expect(result.isSuccess).toBe(true);
      expect(commentVote).toBeInstanceOf(CommentVote);

      expect(commentVotesRepositorySpy.getTimesMethodCalled('save')).toBe(1);
      expect(commentVotesRepositorySpy.getMethodCallArgs('save')[0]).toBe(
        commentVote,
      );

      expect(publishEventsSpy).toHaveBeenCalledTimes(1);
      const [publishedEvents] = publishEventsSpy.mock.calls[0];
      expect(publishedEvents).toHaveLength(1);

      const event = publishedEvents[0] as CommentUpvoted;
      expect(event).toBeInstanceOf(CommentUpvoted);
      expect(event.data.voteId).toBe(commentVote.id);
      expect(event.data.commentId).toBe(existingComment.id);
      expect(event.data.voterId).toBe(author.id);
    });

    it('should unvote the author upvote when the author upvotes again', async () => {
      const expectedScoreChange = -1;

      const author = setupLevel1Member(membersRepositorySpy);
      const { existingComment, authorVote } = setupCommentWithInitialUpvote(
        commentsRepositorySpy,
        commentVotesRepositorySpy,
        { memberId: author.id },
      );

      const input = VoteInputBuilders.aCommentVote()
        .withMemberId(author.id)
        .withCommentId(existingComment.id)
        .asUpvote()
        .build();

      const command = VoteOnCommentCommand.create(input);
      expect(command.isSuccess).toBe(true);

      const result = await voteOnCommentUseCase.execute(command.getValue());
      expect(result.isSuccess).toBe(true);

      const commentVote = result.getValue();
      expect(commentVote).toBeInstanceOf(CommentVote);

      expect(commentVotesRepositorySpy.getTimesMethodCalled('save')).toBe(1);
      expect(commentVotesRepositorySpy.getMethodCallArgs('save')[0]).toBe(
        commentVote,
      );

      expect(publishEventsSpy).toHaveBeenCalledTimes(1);
      const [publishedEvents] = publishEventsSpy.mock.calls[0];
      expect(publishedEvents).toHaveLength(1);

      const event = publishedEvents[0] as CommentUnvoted;
      expect(event).toBeInstanceOf(CommentUnvoted);
      expect(event.data.voteId).toBe(authorVote.id);
      expect(event.data.commentId).toBe(existingComment.id);
      expect(event.data.authorId).toBe(author.id);
      expect(event.data.scoreChange).toBe(expectedScoreChange);
    });

    it('should switch author upvote to downvote with a score change of -2', async () => {
      const expectedScoreChange = -2;

      const author = setupLevel1Member(membersRepositorySpy);
      const { existingComment, authorVote } = setupCommentWithInitialUpvote(
        commentsRepositorySpy,
        commentVotesRepositorySpy,
        { memberId: author.id },
      );

      const input = VoteInputBuilders.aCommentVote()
        .withCommentId(existingComment.id)
        .withMemberId(author.id)
        .asDownvote()
        .build();
      const command = VoteOnCommentCommand.create(input);

      const result = await voteOnCommentUseCase.execute(command.getValue());
      expect(result.isSuccess).toBe(true);

      const commentVote = result.getValue();
      expect(commentVote).toBeInstanceOf(CommentVote);

      expect(commentVotesRepositorySpy.getTimesMethodCalled('save')).toBe(1);
      expect(commentVotesRepositorySpy.getMethodCallArgs('save')[0]).toBe(
        commentVote,
      );

      expect(publishEventsSpy).toHaveBeenCalledTimes(1);
      const [publishedEvents] = publishEventsSpy.mock.calls[0];
      expect(publishedEvents).toHaveLength(1);

      const event = publishedEvents[0] as CommentDownvoted;
      expect(event).toBeInstanceOf(CommentDownvoted);
      expect(event.data.voteId).toBe(authorVote.id);
      expect(event.data.commentId).toBe(existingComment.id);
      expect(event.data.authorId).toBe(author.id);
      expect(event.data.scoreChange).toBe(expectedScoreChange);
    });

    it('should switch author downvote to upvote with a score change of 2', async () => {
      const expectedScoreChange = 2;

      const author = setupLevel1Member(membersRepositorySpy);
      const { existingComment, authorVote } = setupCommentWithInitialDownvote(
        commentsRepositorySpy,
        commentVotesRepositorySpy,
        { memberId: author.id },
      );

      const input = VoteInputBuilders.aCommentVote()
        .withCommentId(existingComment.id)
        .withMemberId(author.id)
        .asUpvote()
        .build();
      const command = VoteOnCommentCommand.create(input);

      const result = await voteOnCommentUseCase.execute(command.getValue());
      expect(result.isSuccess).toBe(true);

      const commentVote = result.getValue();
      expect(commentVote).toBeInstanceOf(CommentVote);

      expect(commentVotesRepositorySpy.getTimesMethodCalled('save')).toBe(1);
      expect(commentVotesRepositorySpy.getMethodCallArgs('save')[0]).toBe(
        commentVote,
      );

      expect(publishEventsSpy).toHaveBeenCalledTimes(1);
      const [publishedEvents] = publishEventsSpy.mock.calls[0];
      expect(publishedEvents).toHaveLength(1);

      const event = publishedEvents[0] as CommentUpvoted;
      expect(event).toBeInstanceOf(CommentUpvoted);
      expect(event.data.voteId).toBe(authorVote.id);
      expect(event.data.commentId).toBe(existingComment.id);
      expect(event.data.authorId).toBe(author.id);
      expect(event.data.scoreChange).toBe(expectedScoreChange);
    });
  });
});
