export const commentErrorCodes = {
  COMMENTS_NOT_FOUND: 'COMMENTS_NOT_FOUND',
  COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
  INVALID_COMMENT: 'INVALID_COMMENT',
} as const;

export type CommentErrorCode =
  (typeof commentErrorCodes)[keyof typeof commentErrorCodes];
