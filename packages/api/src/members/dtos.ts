export const reputationLevel = {
  level1: 'level1',
  level2: 'level2',
  level3: 'level3',
} as const;

export type ReputationLevel =
  (typeof reputationLevel)[keyof typeof reputationLevel];

export type MemberDto = {
  id: string;
  userId: string;
  username: string;
  reputationLevel: ReputationLevel;
  reputationScore: number;
};
