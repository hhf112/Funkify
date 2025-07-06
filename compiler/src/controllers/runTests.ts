import fs from "fs"
import { setDefaultHighWaterMark } from "stream";


export function runTests(output: string,
  expectedOutput: string,
  linesPerTest: number): {
    verdict: string,
    testsPassed: number,
    error: string | null,
  } {
  if (output.length != expectedOutput.length) {
    return {
      error: "output length does not match. testing halted",
      verdict: "Wrong Answer",
      testsPassed: 0,
    }
  }

  const n: number = output.length;
  let lines: number = 0;
  let fail: boolean = false;
  let testsPassed: number = 0;

  for (let i = 0; i < n; i++) {
    if (expectedOutput[i] != output[i]) fail = true;
    if (output[i] === '\n') {
      lines++;
      if (lines % linesPerTest == 0) {
        if (fail) break;
        testsPassed++;
      }
    }
  }

  return {
    verdict: (fail ? "Wrong Answer" : "Accepted"),
    testsPassed: testsPassed,
    error: null,
  }
}
