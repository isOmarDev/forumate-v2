import {
  Comment,
  CreateCommentProps,
} from '../../../src/modules/comments/domain/entities/comment';
import { CommentBody } from '../../../src/modules/comments/domain/value-objects/comment-body';
import { InMemoryCommentsRepository } from '../../../src/modules/comments/infrastructure/repositories/in-memory-comments-repository';
import { InMemoryCommentVotesRepository } from '../../../src/modules/votes/infrastructure/repositories/In-memory-comment-votes-repository';
import { PostCommentInputBuilder } from '../../builders/inputs/comment-input-builder';

import { setupCommentVote } from './votes';

export function setupComment(
  repositorySpy: InMemoryCommentsRepository,
  overrides: Partial<CreateCommentProps> = {},
) {
  const input = new PostCommentInputBuilder().build();

  const commentOrError = Comment.create({
    ...input,
    ...overrides,
    body: CommentBody.create(input.body).getValue(),
  });

  const comment = commentOrError.getValue();

  repositorySpy.seed(comment);

  return comment;
}

export function setupCommentWithInitialUpvote(
  commentsRepository: InMemoryCommentsRepository,
  commentVotesRepository: InMemoryCommentVotesRepository,
  overrides: Partial<CreateCommentProps> = {},
) {
  const existingComment = setupComment(commentsRepository, { ...overrides });
  const authorVote = setupCommentVote(commentVotesRepository, {
    memberId: existingComment.memberId,
    commentId: existingComment.id,
    voteType: 'upvote',
  });

  return { existingComment, authorVote };
}

export function setupCommentWithInitialDownvote(
  commentsRepository: InMemoryCommentsRepository,
  commentVotesRepository: InMemoryCommentVotesRepository,
  overrides: Partial<CreateCommentProps> = {},
) {
  const existingComment = setupComment(commentsRepository, { ...overrides });
  const authorVote = setupCommentVote(commentVotesRepository, {
    memberId: existingComment.memberId,
    commentId: existingComment.id,
    voteType: 'downvote',
  });

  return { existingComment, authorVote };
}
