import '../scripts/load-environment';

import { execSync } from 'node:child_process';
import path from 'node:path';

execSync('prisma migrate reset', {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
});
