import { VoteType } from '@forumate/api/votes';

import {
  CommentVote,
  CreateCommentVoteProps,
} from '../../../src/modules/votes/domain/entities/comment-vote';
import { InMemoryCommentVotesRepository } from '../../../src/modules/votes/infrastructure/repositories/In-memory-comment-votes-repository';
import { VoteInputBuilders } from '../../builders/inputs/vote-input-builders';

type BuildCommentVoteOverrides = Partial<CreateCommentVoteProps> & {
  voteType?: VoteType;
};

export function buildCommentVote(overrides: BuildCommentVoteOverrides = {}) {
  const input = VoteInputBuilders.aCommentVote().build();

  const vote = CommentVote.create({
    memberId: overrides.memberId ?? input.memberId,
    commentId: overrides.commentId ?? input.commentId,
  });

  vote.castVote(overrides.voteType ?? input.voteType);
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
