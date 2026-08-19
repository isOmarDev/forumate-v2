import './load-environment';

import { execSync } from 'node:child_process';

execSync('prisma studio', {
  stdio: 'inherit',
});
