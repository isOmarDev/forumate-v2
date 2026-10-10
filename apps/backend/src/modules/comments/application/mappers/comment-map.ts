import {
  type IToDomainMapper,
  type IToPersistenceMapper,
} from '@forumate/core/application';
import { CommentModel, Persistence } from '@forumate/database';

import { Comment } from '../../domain/entities/comment';

type CommentPersistence = Persistence<CommentModel>;

class CommentMapper
  implements
    IToDomainMapper<CommentModel, Comment>,
    IToPersistenceMapper<Comment, CommentPersistence>
{
  toDomain(persistence: CommentModel): Comment {
    return Comment.reconstitute({
      id: persistence.id,
      body: persistence.body,
      voteScore: persistence.voteScore,
      postId: persistence.postId,
      memberId: persistence.memberId,
      parentCommentId: persistence.parentCommentId ?? undefined,
    });
  }

  toPersistence(comment: Comment): CommentPersistence {
    return {
      id: comment.id,
      body: comment.body,
      voteScore: comment.voteScore,
      postId: comment.postId,
      memberId: comment.memberId,
      parentCommentId: comment.parentCommentId ?? null,
    };
  }
}

export const CommentMap = new CommentMapper();
