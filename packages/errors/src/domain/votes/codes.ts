export const voteErrorCodes = {
  INVALID_VOTE_STATUS: 'INVALID_VOTE_STATUS',
} as const;

export type VoteErrorCode =
  (typeof voteErrorCodes)[keyof typeof voteErrorCodes];

export type VoteErrorCodes = {
  [K in keyof typeof voteErrorCodes]: (typeof voteErrorCodes)[K];
};
