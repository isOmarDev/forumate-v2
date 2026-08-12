import { Result, success, Request, fail } from '@forumate/core';
import { MissingRequestParamsError } from '@forumate/errors/server';
import { ValidationError } from '@forumate/errors/application';

import { DecodedIdToken } from '../users';
import { PostCommentInput } from './inputs';

export class PostCommentCommand {
  private constructor(public readonly props: PostCommentInput) {}

  static create(
    input: PostCommentInput,
  ): Result<PostCommentCommand, ValidationError> {
    const { postId, text, memberId } = input;

    if (!postId) {
      return fail(new ValidationError('postId'));
    }

    if (!text || text.length > 1000) {
      return fail(new ValidationError('text'));
    }

    if (!memberId) {
      return fail(new ValidationError('memberId'));
    }

    return success(new PostCommentCommand(input));
  }

  static fromRequest(
    body: Request['body'],
    _decodedToken: DecodedIdToken | undefined,
  ): Result<PostCommentCommand, MissingRequestParamsError> {
    const input: PostCommentInput = {
      postId: body.postId,
      text: body.text,
      parentCommentId: body.parentCommentId,
      memberId: body.memberId,
    };

    return this.create(input);
  }
}