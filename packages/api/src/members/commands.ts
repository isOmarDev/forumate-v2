import { fail, Request, Result, success } from '@forumate/core';
import { InvalidRequestBodyError } from '@forumate/errors';

import { DecodedIdToken } from '../users';

import { CreateMemberInput } from './inputs';
export class CreateMemberCommand {
  private constructor(public readonly props: CreateMemberInput) {}

  static create(
    decodedToken: DecodedIdToken | undefined,
    body: Request<CreateMemberInput>['body'],
  ): Result<CreateMemberCommand, InvalidRequestBodyError> {
    const email = decodedToken?.email || body.email;
    const userId = decodedToken?.uid || body.userId;
    const username = body.username;

    if (!email) {
      return fail(new InvalidRequestBodyError(['email']));
    }

    if (!userId) {
      return fail(new InvalidRequestBodyError(['userId']));
    }

    if (!username) {
      return fail(new InvalidRequestBodyError(['username']));
    }

    return success(
      new CreateMemberCommand({
        userId,
        username,
        email,
      }),
    );
  }

  static fromRequest(
    decodedToken: DecodedIdToken | undefined,
    body: Request<CreateMemberInput>['body'],
  ): Result<CreateMemberCommand, InvalidRequestBodyError> {
    return this.create(decodedToken, body);
  }
}
