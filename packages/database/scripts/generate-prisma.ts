import { execSync } from 'node:child_process';
import path from 'node:path';

import './load-environment';

execSync('prisma generate', {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
});
