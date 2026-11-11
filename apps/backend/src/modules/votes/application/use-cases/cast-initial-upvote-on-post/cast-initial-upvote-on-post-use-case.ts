import { CastInitialUpvoteOnPostCommand } from '@forumate/api/votes';
import { IEventBus } from '@forumate/bus';
import { IUseCase } from '@forumate/core/application';

import type { IPostsRepository } from '../../../../posts/application/ports';
import { PostVote } from '../../../domain/entities/post-vote';
import type { IPostVotesRepository } from '../../ports';

export class CastInitialUpvoteOnPostUseCase implements IUseCase<
  CastInitialUpvoteOnPostCommand,
  void
> {
  constructor(
    private readonly postsRepository: IPostsRepository,
    private readonly postVotesRepository: IPostVotesRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(command: CastInitialUpvoteOnPostCommand) {
    // Usecase should be wrapped in a unit of work (transaction)
    // Event should saved in db (outbox pattern)
    const { postId, memberId } = command.props;

    const existingVote = await this.postVotesRepository.findByMemberAndPostId(
      memberId,
      postId,
    );

    if (existingVote) return;

    const postVote = PostVote.create({ memberId, postId });

    const { scoreChange } = postVote.castVote('upvote', memberId);

    await this.postVotesRepository.save(postVote);
    await this.postsRepository.updateVoteScore(postId, scoreChange);
    await this.eventBus.publishEvents(postVote.getDomainEvents());
  }
}
