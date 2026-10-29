import {
  Comment,
  CreateCommentProps,
} from '../../../src/modules/comments/domain/entities/comment';
import { CommentBody } from '../../../src/modules/comments/domain/value-objects/comment-body';
import { InMemoryCommentsRepository } from '../../../src/modules/comments/infrastructure/repositories/in-memory-comments-repository';
import { PostCommentInputBuilder } from '../../builders/inputs/comment-input-builder';

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
