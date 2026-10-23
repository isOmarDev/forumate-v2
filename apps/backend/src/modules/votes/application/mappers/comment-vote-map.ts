import type {
  IToDomainMapper,
  IToPersistenceMapper,
} from '@forumate/core/application';
import { type CommentVoteModel } from '@forumate/database';

import { CommentVote } from '../../domain/entities/comment-vote';
import { VoteStatus } from '../../domain/value-objects/vote-status';

type CommentVotePersistence = Omit<CommentVoteModel, 'createdAt' | 'updatedAt'>;

class CommentVoteMapper
  implements
    IToDomainMapper<CommentVoteModel, CommentVote>,
    IToPersistenceMapper<CommentVote, CommentVotePersistence>
{
  public toDomain(persistence: CommentVoteModel): CommentVote {
    return CommentVote.reconstitute({
      id: persistence.id,
      commentId: persistence.commentId,
      memberId: persistence.memberId,
      voteStatus: VoteStatus.reconstituteFromValue(persistence.value),
    });
  }

  public toPersistence(commentVote: CommentVote): CommentVotePersistence {
    return {
      id: commentVote.id,
      commentId: commentVote.commentId,
      memberId: commentVote.memberId,
      value: commentVote.getValue(),
    };
  }
}

export const CommentVoteMap = new CommentVoteMapper();
