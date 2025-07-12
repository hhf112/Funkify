import { exec, ExecFileException } from "child_process";
import { warn } from "console";
import fs from "fs";
import path, { resolve } from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputPath = path.join(__dirname, "../../outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}


export interface OutputType {
  compilation: boolean,
  runtime: boolean,
  stdout: string,
  stderr: string,
  error: string | null,
}
export const execCpp = async (filepath: string, input: string, timelimit: number): Promise<OutputType> => {

  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  // check for compilation error
  try {
    await new Promise((resolve, reject) => {
      exec(`g++ ${filepath} -o ${outPath}`,
        (error: ExecFileException | null, stdout: string, stderr: string) => {
          if (error) {
            reject({ error, stderr, stdout });
          }
          resolve({ stderr, stdout });
        }
      );
    });
  } catch (err: any) {
    console.log(err);
    return {
      compilation: false,
      runtime: false,
      stdout: err.stdout,
      stderr: err.stderr,
      error: `g++ exited with code ${err.error.code}`,
    }
  }

  try {
    const { stderr, stdout } = await new Promise<{
      stderr: string,
      stdout: string,
    }>((resolve, reject) => {
      exec(`cd ${outputPath} && echo "${input}" | ./${jobId}.out`,
           {timeout: timelimit * 1000},
        (error: ExecFileException | null, stdout: string, stderr: string) => {
          if (error) {
            reject({ error, stdout, stderr });
          }
          resolve({ stderr, stdout });
        }
      );
    });
    return {
      compilation: true,
      runtime: true,
      stdout: stdout || "",
      stderr: stderr || "",
      error: null,
    }
  } catch (err: any) {
    let errorMsg = null;
    if (err.error?.signal) {
      switch (err.error.signal) {
        case "SIGSEGV":
          errorMsg = "Segmentation fault.";
          break;
        case "SIGABRT":
          errorMsg = "Aborted.";
          break;
        case "SIGFPE":
          errorMsg = "Floating point exception.";
          break;
        case "SIGILL":
          errorMsg = "Illegal instruction.";
          break;
        case "SIGBUS":
          errorMsg = "Bus error.";
          break;
        default:
          errorMsg = `Terminated by signal: ${err.error.signal}. Timed out.`;
      }
    }
    else if (err.error?.code) errorMsg = `Exited with code ${err.error.code}`;
    return {
      compilation: true,
      runtime: false,
      stdout: err.stdout || "",
      stderr: err.stderr || "",
      error: errorMsg,
    }
  }
};

