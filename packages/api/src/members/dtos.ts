export const ReputationLevel = {
  Level1: 'Level1',
  Level2: 'Level2',
  Level3: 'Level3',
} as const;

export type ReputationLevel =
  (typeof ReputationLevel)[keyof typeof ReputationLevel];

export type MemberDTO = {
  userId: string;
  memberId: string;
  username: string;
  reputationLevel: ReputationLevel;
  reputationScore: number;
};