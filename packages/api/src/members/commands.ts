import { fail, Request, Result, success } from '@forumate/core';
import { MissingRequestParamsError } from '@forumate/errors/server';

import { DecodedIdToken } from '../users';

import { CreateMemberInput } from './inputs';

export class CreateMemberCommand {
  private constructor(public readonly props: CreateMemberInput) {}

  static create(
    decodedToken: DecodedIdToken | undefined,
    body: Request['body'],
  ): Result<CreateMemberCommand, MissingRequestParamsError> {
    const email = decodedToken?.email || body.email;
    const userId = decodedToken?.uid || body.userId;
    const username = body.username;

    if (!email) {
      return fail(new MissingRequestParamsError(['email']));
    }

    if (!userId) {
      return fail(new MissingRequestParamsError(['userId']));
    }

    if (!username) {
      return fail(new MissingRequestParamsError(['username']));
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
    body: Request['body'],
  ): Result<CreateMemberCommand, MissingRequestParamsError> {
    return this.create(decodedToken, body);
  }
}