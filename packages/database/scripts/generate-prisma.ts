import './load-environment';

import { execSync } from 'node:child_process';
import path from 'node:path';

execSync('prisma generate', {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
});
