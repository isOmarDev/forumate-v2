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
// The database env (DATABASE_URL) is loaded by the @forumate/database package.
const envFile = process.env.TEST_ENV_FILE || '.env.test';
const nodeOptions =
  process.env.NODE_OPTIONS != null
    ? `${process.env.NODE_OPTIONS} --experimental-vm-modules`
    : '--experimental-vm-modules';

const result = spawnSync(
  process.execPath,
  [`--env-file=${envFile}`, jestBin, ...args],
  { stdio: 'inherit', env: { ...process.env, NODE_OPTIONS: nodeOptions } },
);

process.exit(result.status ?? 1);