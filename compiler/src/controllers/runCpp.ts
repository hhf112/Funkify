import { exec, ExecFileException } from "child_process";
import fs from "fs";
import path, { resolve } from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from "uuid";
import { generateFile } from "./generateFile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputPath = path.join(__dirname, "../../outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

export interface ExecStatusType {
  success: boolean,
  runtime_ms: number,
  stdout: string,
  stderr: string,
  errorMessage: string | null,
}

export interface CompileStatusType {
  success: boolean,
  binaryPath: string | null,
  stdout: string | null,
  stderr: string | null,
  errorMessage: string | null,
}

export const cppCompile = async (input: string, format: string): Promise<CompileStatusType> => {
  const filePath = generateFile("../../codes", format, input);
  const binaryPath = `${path.join(outputPath, path.basename(filePath, path.extname(filePath)))}.out`;

  // console.log(`g++ ${ filePath } -o ${ binaryPath }`);
  try {
    await new Promise((resolve, reject) => {
      exec(`g++ ${filePath} -o ${binaryPath}`,
        (error: ExecFileException | null, stdout: string, stderr: string) => {
          if (error) {
            return reject({ error, stderr, stdout });
          }
          resolve({ stderr, stdout });
        }
      );
    });
    return {
      success: true,
      binaryPath: binaryPath,
      stdout: null,
      stderr: null,
      errorMessage: null,
    }
  } catch (err: any) {
    return {
      success: false,
      binaryPath: null,
      stdout: err.stdout || "null",
      stderr: err.stderr || "null",
      errorMessage: `g++ exited with code ${err.error.code}`,
    }
  }
}

export const cppExec = async (binaryPath: string, timeLimit: number): Promise<ExecStatusType> => {
  const start = process.hrtime();
  try {
    const { stderr, stdout } = await new Promise<{
      stderr: string,
      stdout: string,
    }>((resolve, reject) => {
      exec(`${binaryPath}`, { timeout: timeLimit * 1000 },
        (error: any, stdout: string, stderr: string) => {
          if (error) {
            return reject({ error, stdout, stderr });
          }
          resolve({ stderr, stdout });
        }
      );
    });

    const end = process.hrtime(start);
    return {
      runtime_ms: end[1] * 1000000,
      success: true,
      stdout: stdout || "null",
      stderr: stderr || "null",
      errorMessage: null,
    }
  } catch (err: any) {
    let errorMsg = "";
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
          errorMsg = `timed out.`;
      }
    }
    else if (err.error?.code) errorMsg = `Exited with code ${err.error.code}`;
    return {
      runtime_ms: -1,
      success: true,
      stdout: err.stdout || "null",
      stderr: err.stderr || "null",
      errorMessage: errorMsg,
    }
  }
}

