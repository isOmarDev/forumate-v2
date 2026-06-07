import { execSync } from 'child_process';
import * as path from 'path';

export const prepareEnv = (): void => {
  const env = process.env.NODE_ENV || 'development';
  const packageRoot = path.resolve(__dirname);
  const execParams = {
    cwd: packageRoot,
    stdio: 'inherit',
  } as const;

  const script = process.argv.splice(2).join(' ');

  if (env === 'development') {
    const devEnvFile = '.env.development';
    console.log(`Preparing dev environment using ${devEnvFile}`);
    execSync(`dotenv -e ${devEnvFile} -- ${script}`, execParams);
    return;
  }

  console.log(
    `Running ${script} in ${process.env.NODE_ENV} mode without loading from env file.`,
  );
  execSync(`${script}`, execParams);
};

prepareEnv();
