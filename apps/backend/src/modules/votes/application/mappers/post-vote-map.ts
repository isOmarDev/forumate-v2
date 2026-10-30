import type {
  IToDomainMapper,
  IToPersistenceMapper,
} from '@forumate/core/application';
import { type PostVoteModel, type Persistence } from '@forumate/database';

import { PostVote } from '../../domain/entities/post-vote';
import { VoteStatus } from '../../domain/value-objects/vote-status';

type PostVotePersistence = Persistence<PostVoteModel>;

class PostVoteMapper
  implements
    IToDomainMapper<PostVoteModel, PostVote>,
    IToPersistenceMapper<PostVote, PostVotePersistence>
{
  public toDomain(persistence: PostVoteModel): PostVote {
    return PostVote.reconstitute({
      id: persistence.id,
      postId: persistence.postId,
      memberId: persistence.memberId,
      voteStatus: VoteStatus.reconstituteFromValue(persistence.value),
    });
  }

  public toPersistence(vote: PostVote): PostVotePersistence {
    return {
      id: vote.id,
      postId: vote.postId,
      memberId: vote.memberId,
      value: vote.getValue(),
    };
  }
}

export const PostVoteMap = new PostVoteMapper();
