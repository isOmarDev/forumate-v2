import { CastInitialUpvoteOnCommentCommand } from '@forumate/api/votes';
import { IEventBus } from '@forumate/bus';
import { IUseCase } from '@forumate/core/application';

import type { ICommentsRepository } from '../../../../comments/application/ports';
import { CommentVote } from '../../../domain/entities/comment-vote';
import { ICommentVotesRepository } from '../../ports';

export class CastInitialUpvoteOnCommentUseCase implements IUseCase<
  CastInitialUpvoteOnCommentCommand,
  void
> {
  constructor(
    private readonly commentsRepository: ICommentsRepository,
    private readonly commentVotesRepository: ICommentVotesRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(command: CastInitialUpvoteOnCommentCommand) {
    // Usecase should be wrapped in a unit of work (transaction)
    // Event should saved in db (outbox pattern)
    const { commentId, memberId } = command.props;

    const existingVote =
      await this.commentVotesRepository.findByMemberAndCommentId(
        memberId,
        commentId,
      );

    if (existingVote) return;

    const commentVote = CommentVote.create({ memberId, commentId });

    const { scoreChange } = commentVote.castVote('upvote', memberId);

    await this.commentVotesRepository.save(commentVote);
    await this.commentsRepository.updateVoteScore(commentId, scoreChange);
    await this.eventBus.publishEvents(commentVote.getDomainEvents());
  }
}
