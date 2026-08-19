import path from 'node:path';

export function loadEnvironment(): void {
  const environment = process.env.NODE_ENV ?? 'development';
  const envFile = path.join(__dirname, `../.env.${environment}`);

  process.loadEnvFile(envFile);
}

loadEnvironment();
