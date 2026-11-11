import { ValidationError } from '@forumate/errors/application';
import { voteErrorCodes } from '@forumate/errors/domain';

export class InvalidVoteStatusError extends ValidationError {
  readonly code = voteErrorCodes.INVALID_VOTE_STATUS;

  constructor(status: string) {
    super(`Invalid vote status: ${status}`);
  }
}
