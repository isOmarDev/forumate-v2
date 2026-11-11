import { randomUUID } from 'node:crypto';

import { VoteType } from '@forumate/api/votes';

import {
  CommentVote,
  CreateCommentVoteProps,
} from '../../../src/modules/votes/domain/entities/comment-vote';
import { InMemoryCommentVotesRepository } from '../../../src/modules/votes/infrastructure/repositories/in-memory/In-memory-comment-votes-repository';
import { VoteInputBuilders } from '../../builders/inputs/vote-input-builders';

type BuildCommentVoteOverrides = Partial<CreateCommentVoteProps> & {
  voteType?: VoteType;
  authorId?: string;
};

export function buildCommentVote(overrides: BuildCommentVoteOverrides = {}) {
  const input = VoteInputBuilders.aCommentVote().build();

  const vote = CommentVote.create({
    memberId: overrides.memberId ?? input.memberId,
    commentId: overrides.commentId ?? input.commentId,
  });

  const authorId = overrides.authorId ?? randomUUID();

  vote.castVote(overrides.voteType ?? input.voteType, authorId);

  // clear this initial upvote event so that it doesnt interfer with the test
  vote.clearDomainEvents();

  return vote;
}

export function setupCommentVote(
  inMemoryCommentVotesRepository: InMemoryCommentVotesRepository,
  overrides: BuildCommentVoteOverrides = {},
) {
  const existingVote = buildCommentVote(overrides);

  inMemoryCommentVotesRepository.seed(existingVote);

  return existingVote;
}
