export const commentErrorCodes = {
  COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
  INVALID_COMMENT_BODY: 'INVALID_COMMENT_BODY',
} as const;

export type CommentErrorCode =
  (typeof commentErrorCodes)[keyof typeof commentErrorCodes];
