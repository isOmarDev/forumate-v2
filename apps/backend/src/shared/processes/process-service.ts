import { exec } from 'child_process';

export class ProcessService {
  public static killProcessOnPort(port: number, cb: () => void) {
    const killCommand =
      process.platform === 'win32'
        ? `netstat -ano | findstr :${port} | findstr LISTENING`
        : `lsof -i:${port} -t`;

    exec(killCommand, (error, stdout, stderr) => {
      if (error || stderr) {
        return cb ? cb() : '';
      }

      // Windows netstat emits one line per protocol (IPv4 + IPv6); the PID is
      // the last whitespace-delimited token of every LISTENING line.
      const processIds =
        process.platform === 'win32'
          ? stdout
              .split(/\r?\n/)
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line) => line.split(/\s+/).pop() || '')
              .filter((pid) => /^\d+$/.test(pid))
          : stdout
              .split(/\r?\n/)
              .map((line) => line.trim())
              .filter(Boolean);

      if (processIds.length === 0) {
        return cb ? cb() : '';
      }

      const killProcessCommand =
        process.platform === 'win32'
          ? `taskkill /F /PID ${processIds.join(' /PID ')}`
          : `kill ${processIds.join(' ')}`;

      exec(killProcessCommand, (killError, _stdout, _stderr) => {
        if (killError) {
          // console.error(`Failed to kill the process: ${killError.message}`);
          return cb ? cb() : '';
        }
        // console.log(`Process running on port ${port} has been killed.`);
        return cb ? cb() : '';
      });
    });
  }
}
