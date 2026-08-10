import { execSync } from 'node:child_process';
import path from 'node:path';

import '../scripts/load-environment';

execSync('prisma migrate reset', {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
});
