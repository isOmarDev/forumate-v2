import path from 'node:path';
import process from 'node:process';

/**
 * Loads the appropriate local .env file if no environment
 * has already been provided by the host (Render, Docker, CI, etc.).
 */
export function loadEnvironment(): void {
  // Environment already prepared (CI/CD, Docker, Render...)
  if (process.env.DATABASE_URL) {
    return;
  }

  const environment = process.env.NODE_ENV ?? 'development';
  const envFile = path.join(__dirname, `../.env.${environment}`);

  process.loadEnvFile(envFile);
}

loadEnvironment();
