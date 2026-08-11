import { exec } from 'child_process';

export class ProcessService {
  public static killProcessOnPort(port: number, cb: () => void) {
    const killCommand =
      process.platform === 'win32'
        ? `netstat -ano | findstr :${port} | findstr LISTENING`
        : `lsof -i:${port} -t`;

    exec(killCommand, (error, stdout, stderr) => {
      if (error) {
        // console.error(`Failed to execute the command: ${error.message}`);
        return cb ? cb() : '';
      }

      if (stderr) {
        // console.error(`Command execution returned an error: ${stderr}`);
        return cb ? cb() : '';
      }

      const processId = stdout.trim();
      if (processId) {
        const killProcessCommand =
          process.platform === 'win32'
            ? `taskkill /F /PID ${processId}`
            : `kill ${processId}`;

        exec(killProcessCommand, (error, _stdout, _stderr) => {
          if (error) {
            // console.error(`Failed to kill the process: ${error.message}`);
            return cb ? cb() : '';
          }
          // console.log(`Process running on port ${port} has been killed.`);
          return cb ? cb() : '';
        });
      } else {
        // console.log(`No process found running on port ${port}.`);
        return cb ? cb() : '';
      }
    });
  }
}
