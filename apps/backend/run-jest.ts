import { spawnSync } from 'child_process';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(__filename);
const args = process.argv.slice(2);

// Resolve jest's bin path dynamically (portable across workspaces/hoisting layouts)
const jestPkgJsonPath = require.resolve('jest/package.json');
const jestPkgJson = require(jestPkgJsonPath) as {
  bin: string | Record<string, string>;
};
const binPath =
  typeof jestPkgJson.bin === 'string'
    ? jestPkgJson.bin
    : jestPkgJson.bin['jest'];
const jestBin = path.resolve(path.dirname(jestPkgJsonPath), binPath);

// Keep the modern node --env-file loader (cannot be set via NODE_OPTIONS)
// The backend env file provides app config (API_URL, NODE_ENV).
// The database env (DATABASE_URL) is loaded by the @forumate/database package
// for regular scripts, but `process.loadEnvFile()` does not populate
// `process.env` inside the jest sandbox, so we load it natively here as well.
const envFile = process.env.TEST_ENV_FILE || '.env.test';
const databaseEnvFile =
  process.env.DATABASE_ENV_FILE ||
  path.resolve(__dirname, '../../packages/database/.env.test');
const nodeOptions =
  process.env.NODE_OPTIONS != null
    ? `${process.env.NODE_OPTIONS} --experimental-vm-modules`
    : '--experimental-vm-modules';

// E2E suites start a live HTTP server and hold the event loop open (keep-alive
// client sockets), which makes Jest 30 report a nonzero exit code after a 1s
// grace period. Force-exit deterministically so `pnpm test:e2e:back` is clean.
const isE2E = args.some(
  (arg) => arg.includes('jest.config.e2e') || arg.includes('.e2e.'),
);
const jestArgs = isE2E ? [...args, '--forceExit'] : args;

const result = spawnSync(
  process.execPath,
  [
    `--env-file=${envFile}`,
    `--env-file=${databaseEnvFile}`,
    jestBin,
    ...jestArgs,
  ],
  { stdio: 'inherit', env: { ...process.env, NODE_OPTIONS: nodeOptions } },
);

process.exit(result.status ?? 1);
