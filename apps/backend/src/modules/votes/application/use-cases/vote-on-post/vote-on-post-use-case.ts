import { VoteOnPostCommand } from '@forumate/api/votes';
import { type IEventBus } from '@forumate/bus';
import { Result, success, fail, type IUseCase } from '@forumate/core';

import type { IMembersRepository } from '../../../../members/application/ports/members-repository';
import {
  InsufficientMemberLevelError,
  MemberNotFoundError,
} from '../../../../members/domain/errors/member-errors';
import type { IPostsRepository } from '../../../../posts/application/ports/posts-repository';
import { PostNotFoundError } from '../../../../posts/domain/errors/posts-errors';
import { PostVote } from '../../../domain/entities/post-vote';
import { CanVoteOnPostPolicy } from '../../../domain/policies/can-vote-on-post';
import type { IPostVotesRepository } from '../../ports/post-votes-repository';

export type VoteOnPostError =
  PostNotFoundError | MemberNotFoundError | InsufficientMemberLevelError;
export type VoteOnPostResponse = Result<PostVote, VoteOnPostError>;

export class VoteOnPostUseCase implements IUseCase<
  VoteOnPostCommand,
  VoteOnPostResponse
> {
  constructor(
    private readonly membersRepository: IMembersRepository,
    private readonly postsRepository: IPostsRepository,
    private readonly postVotesRepository: IPostVotesRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(command: VoteOnPostCommand): Promise<VoteOnPostResponse> {
    const { postId, memberId, voteType } = command.props;

    const [member, post] = await Promise.all([
      this.membersRepository.findById(memberId),
      this.postsRepository.findById(postId),
    ]);

    if (!member) return fail(new MemberNotFoundError());
    if (!post) return fail(new PostNotFoundError());

    const canVoteOnPost = CanVoteOnPostPolicy.check(member, post);
    if (canVoteOnPost.isFailure) {
      return fail(canVoteOnPost.getError());
    }

    const existingVote = await this.postVotesRepository.findByMemberAndPostId(
      memberId,
      postId,
    );

    const postVote = existingVote ?? PostVote.create({ memberId, postId });

    const { scoreChange } = postVote.castVote(voteType, post.memberId);

    await this.postVotesRepository.save(postVote);
    // updateVoteScore in comment should be triggered via event
    await this.postsRepository.updateVoteScore(postId, scoreChange);
    await this.eventBus.publishEvents(postVote.getDomainEvents());

    return success(postVote);
  }
}
