import { Result, success, fail, type Request } from '@forumate/core';
import { InvalidInputError, InvalidRequestBodyError } from '@forumate/errors';

import { type DecodedIdToken } from '../users';

import { PostCommentInput } from './inputs';
export class PostCommentCommand {
  private constructor(public readonly props: PostCommentInput) {}

  static fromRequest(
    body: Request<PostCommentInput>['body'],
    decodedToken: DecodedIdToken | undefined,
  ): Result<PostCommentCommand, InvalidRequestBodyError | InvalidInputError> {
    const input: PostCommentInput = {
      postId: body.postId,
      text: body.text,
      parentCommentId: body.parentCommentId,
      memberId: body.memberId,
    };

    return this.create(input);
  }

  static create(
    input: PostCommentInput,
  ): Result<PostCommentCommand, InvalidInputError> {
    const { postId, text, memberId } = input;

    if (!postId) {
      return fail(new InvalidInputError(['postId']));
    }

    if (!text || text.length > 1000) {
      return fail(new InvalidInputError(['text']));
    }

    if (!memberId) {
      return fail(new InvalidInputError(['memberId']));
    }

    return success(new PostCommentCommand(input));
  }
}
