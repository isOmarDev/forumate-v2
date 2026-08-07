import { execSync } from 'node:child_process';
import * as path from 'node:path';

export const prepareEnv = (): void => {
  const env = process.env.NODE_ENV ?? 'development';
  const packageRoot = path.resolve(__dirname);

  const script = process.argv.slice(2).join(' ');

  if (env === 'development') {
    const envFile = path.join(packageRoot, '.env.development');

    console.log(`Preparing dev environment using ${envFile}`);

    process.loadEnvFile(envFile);
  } else {
    console.log(
      `Running ${script} in ${env} mode without loading an env file.`,
    );
  }

  execSync(script, {
    cwd: packageRoot,
    stdio: 'inherit',
  });
};

prepareEnv();
