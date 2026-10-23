import { IDatabase } from '@forumate/database';

import type { ICommentsReadRepository } from '../ports/comments-read-repository';
import { CommentReadModel } from '../read-models/comment-read-model';

export class CommentProjector {
  constructor(
    private readonly database: IDatabase,
    private readonly commentReadRepository: ICommentsReadRepository,
  ) {}

  public async projectComment(commentId: string): Promise<void> {
    const db = this.database.getClient();

    const row = await db.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        postId: true,
        parentCommentId: true,
        body: true,
        voteScore: true,
        createdAt: true,
        member: {
          select: { id: true, username: true, reputationLevel: true },
        },
        _count: { select: { replyComments: true } },
      },
    });
    if (!row) return;

    const readModel = CommentReadModel.create({
      id: row.id,
      postId: row.postId,
      parentCommentId: row.parentCommentId,
      body: row.body,
      voteScore: row.voteScore,
      replyCount: row._count.replyComments,
      author: {
        id: row.member.id,
        username: row.member.username,
        reputationLevel: row.member.reputationLevel,
      },
      postedAt: row.createdAt,
    });

    await this.commentReadRepository.save(readModel);
  }

  public async refreshReplyCount(commentId: string): Promise<void> {
    await this.database.getClient().$executeRaw`
    UPDATE "CommentRead"
    SET "replyCount" = (
      SELECT COUNT(*) FROM "Comment" WHERE "parentCommentId" = ${commentId}
    )
    WHERE id = ${commentId}
  `;
  }
}
