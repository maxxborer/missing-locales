import { exec } from "child_process";

export type CLIResult = {
  code: number;
  error: Error | null;
  stdout: string;
  stderr: string;
};

export default function cli(path: string, args: string[]) {
  return new Promise((resolve) => {
    exec(`node ${path} ${args.join(" ")}`, { cwd: "./" }, (error, stdout, stderr) => {
      resolve({
        code: error && error.code ? error.code : 0,
        error,
        stdout,
        stderr,
      });
    });
  });
}
