import type {
  IToDomainMapper,
  IToPersistenceMapper,
} from '@forumate/core/application';
import { type CommentVoteModel } from '@forumate/database';
import { type Persistence } from '@forumate/database';

import { CommentVote } from '../../domain/entities/comment-vote';
import { VoteStatus } from '../../domain/value-objects/vote-status';

type CommentVotePersistence = Persistence<CommentVoteModel>;

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

  public toPersistence(vote: CommentVote): CommentVotePersistence {
    return {
      id: vote.id,
      commentId: vote.commentId,
      memberId: vote.memberId,
      value: vote.getValue(),
    };
  }
}

export const CommentVoteMap = new CommentVoteMapper();
