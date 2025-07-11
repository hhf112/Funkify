import fs, { read } from "fs"
import { loadEnvFile } from "process";
import { OutputFileType } from "typescript";

export function runTests(output: string, testLines: string[], linesPerTest: number): {
  verdict: string,
  testsPassed: number,
  error: string | null,
} {
  const outputLines = output.split('\n');

  let lout = outputLines.length;
  let ltest = testLines.length;

  if (!outputLines[lout - 1]) lout--;


  let testsPassed = 0;
  let fail = -1;
  let outputBuffer = "", testBuffer = ""

  let testcnt = 0;
  for (let i = 1; i <= Math.min(ltest, lout); i++) {
    outputBuffer += outputLines[i - 1].trim();
    testBuffer += testLines[i - 1].trim();
    if (i % linesPerTest == 0) {
      testcnt++;
      if (outputBuffer != testBuffer) {
        if (fail < 0) fail = i;
      }
      else {
        testsPassed++;
      }
      outputBuffer = "";
      testBuffer = "";
    }
  }
  if (lout != ltest) {
    return {
      verdict: "Wrong Answer",
      testsPassed: testsPassed,
      error: "Output length mismatch",
    }
  }

  return {
    verdict: (fail < 0 ? "Accepted" : "Wrong Answer"),
    testsPassed: testsPassed,
    error: null,
  }

}
