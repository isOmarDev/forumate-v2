import { PrismaCommentReadModel } from '@forumate/database';

import { CommentReadModel } from '../read-models/comment-read-model';

export class CommentReadModelMap {
  public static fromPersistence(
    prismaCommentReadModel: PrismaCommentReadModel,
  ): CommentReadModel {
    return new CommentReadModel({
      id: prismaCommentReadModel.id,
      postId: prismaCommentReadModel.postId,
      parentCommentId: prismaCommentReadModel.parentCommentId,
      body: prismaCommentReadModel.body,
      voteScore: prismaCommentReadModel.voteScore,
      replyCount: prismaCommentReadModel.replyCount,
      author: {
        id: prismaCommentReadModel.authorId,
        username: prismaCommentReadModel.authorUsername,
        reputationLevel: prismaCommentReadModel.authorReputationLevel,
      },
      postedAt: prismaCommentReadModel.postedAt,
    });
  }

  public static toPersistence(
    readModel: CommentReadModel,
  ): Omit<PrismaCommentReadModel, 'projectedAt'> {
    return {
      id: readModel.id,
      postId: readModel.postId,
      parentCommentId: readModel.parentCommentId,
      body: readModel.body,
      voteScore: readModel.voteScore,
      replyCount: readModel.replyCount,
      authorId: readModel.author.id,
      authorUsername: readModel.author.username,
      authorReputationLevel: readModel.author.reputationLevel,
      postedAt: readModel.postedAt,
    };
  }
}
