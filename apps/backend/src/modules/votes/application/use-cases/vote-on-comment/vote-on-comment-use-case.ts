import { VoteOnCommentCommand } from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';
import { Result, success, fail, type IUseCase } from '@forumate/core';

import { type ICommentsRepository } from '../../../../comments/application/ports/comments-repository';
import { CommentNotFoundError } from '../../../../comments/domain/errors/comment-errors';
import { type IMembersRepository } from '../../../../members/application/ports/members-repository';
import {
  InsufficientMemberLevelError,
  MemberNotFoundError,
} from '../../../../members/domain/errors/member-errors';
import { CommentVote } from '../../../domain/entities/comment-vote';
import { CanVoteOnCommentPolicy } from '../../../domain/policies/can-vote-on-comment';
import type { ICommentVotesRepository } from '../../ports/comment-votes-repository';

export type VoteOnCommentError =
  InsufficientMemberLevelError | MemberNotFoundError | CommentNotFoundError;
export type VoteOnCommentResponse = Result<CommentVote, VoteOnCommentError>;

export class VoteOnCommentUseCase implements IUseCase<
  VoteOnCommentCommand,
  VoteOnCommentResponse
> {
  constructor(
    private commentVotesRepository: ICommentVotesRepository,
    private membersRepository: IMembersRepository,
    private commentsRepository: ICommentsRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(command: VoteOnCommentCommand): Promise<VoteOnCommentResponse> {
    const { commentId, memberId, voteType } = command.props;

    const [member, comment] = await Promise.all([
      this.membersRepository.findById(memberId),
      this.commentsRepository.findById(commentId),
    ]);

    if (!member) return fail(new MemberNotFoundError());
    if (!comment) return fail(new CommentNotFoundError());

    const canVoteOnComment = CanVoteOnCommentPolicy.check(member, comment);
    if (canVoteOnComment.isFailure) {
      return fail(canVoteOnComment.getError());
    }

    const existingVote =
      await this.commentVotesRepository.findByMemberAndCommentId(
        memberId,
        commentId,
      );

    const commentVote =
      existingVote ?? CommentVote.create({ commentId, memberId });

    const { scoreChange } = commentVote.castVote(voteType, comment.memberId);

    await this.commentVotesRepository.save(commentVote);
    // updateVoteScore in comment should be triggered via event
    await this.commentsRepository.updateVoteScore(commentId, scoreChange);
    await this.eventBus.publishEvents(commentVote.getDomainEvents());

    return success(commentVote);
  }
}
