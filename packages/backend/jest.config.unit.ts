import type { JestConfigWithTsJest } from 'ts-jest';

export default async (): Promise<JestConfigWithTsJest> => ({
  displayName: 'Backend (unit)',
  testMatch: ['**/@(src|tests)/**/*.@(unit).*'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { diagnostics: false }],
  },
  maxWorkers: 1,
  verbose: true,
});
