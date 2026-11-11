import { UpdateMemberReputationCommand } from '@forumate/api/members';
import { type IEventBus } from '@forumate/bus';
import { type IEventSubscriptions } from '@forumate/core';

import {
  CommentDownvoted,
  CommentUnvoted,
  CommentUpvoted,
  PostUpvoted,
  PostDownvoted,
  PostUnvoted,
} from '../../../votes/domain/events';
import { MembersService } from '../members-service';

export class MembersSubscriptions implements IEventSubscriptions {
  constructor(
    private eventBus: IEventBus,
    private membersService: MembersService,
  ) {}

  public register(): void {
    this.eventBus.subscribe<PostUpvoted>(
      PostUpvoted.name,
      this.onPostVoteChanged.bind(this),
    );
    this.eventBus.subscribe<PostDownvoted>(
      PostDownvoted.name,
      this.onPostVoteChanged.bind(this),
    );
    this.eventBus.subscribe<CommentUpvoted>(
      CommentUpvoted.name,
      this.onCommentVoteChanged.bind(this),
    );
    this.eventBus.subscribe<CommentDownvoted>(
      CommentDownvoted.name,
      this.onCommentVoteChanged.bind(this),
    );
  }

  private async onPostVoteChanged(
    event: PostUpvoted | PostDownvoted | PostUnvoted,
  ): Promise<void> {
    const { authorId, isSelfVote, scoreChange } = event.data;

    if (isSelfVote) return;

    const commandOrError = UpdateMemberReputationCommand.create({
      memberId: authorId,
      scoreChange,
    });

    if (commandOrError.isFailure) {
      console.error('Invalid reputation command', commandOrError.getError());
      return;
    }

    await this.membersService.UpdateMemberReputation(commandOrError.getValue());
  }

  private async onCommentVoteChanged(
    event: CommentUpvoted | CommentDownvoted | CommentUnvoted,
  ): Promise<void> {
    const { authorId, isSelfVote, scoreChange } = event.data;

    if (isSelfVote) return;

    const commandOrError = UpdateMemberReputationCommand.create({
      memberId: authorId,
      scoreChange,
    });

    if (commandOrError.isFailure) {
      console.error('Invalid reputation command', commandOrError.getError());
      return;
    }

    await this.membersService.UpdateMemberReputation(commandOrError.getValue());
  }
}
